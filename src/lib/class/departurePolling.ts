import type { PublicTransport } from '../../main';
import type { ITransportService } from '../types/transportService';
import { PollingManager } from './pollingManager';

interface DepartureConfig {
    id: string;
    enabled: boolean;
    customName?: string;
    name?: string;
    offsetTime?: number;
    duration?: number;
    numDepartures?: number;
    products?: any;
    client_profile?: string;
}

export class DeparturePolling extends PollingManager<DepartureConfig> {
    constructor(adapter: PublicTransport) {
        super(adapter);
    }

    /**
     * Setzt die States von deaktivierten Stationen auf Standardwerte zurück.
     *
     * @param configs Alle Station-Konfigurationen
     */
    protected async handleDisabledConfigs(configs: DepartureConfig[] | undefined): Promise<void> {
        if (!configs || configs.length === 0) {
            return;
        }

        const disabledConfigs = configs.filter(config => config.enabled === false);

        for (const config of disabledConfigs) {
            if (!config.id) {
                continue;
            }

            this.adapter.log.debug(
                `Setze States für deaktivierte Station zurück: ${config.customName || config.name || ''} (${config.id})`,
            );

            // Verwende garbageColleting um States auf Standardwerte zu setzen
            await this.adapter.library.garbageColleting(
                `Stations.${config.id}.`,
                2000, // offset = 0 bedeutet: alle States sofort zurücksetzen
                false, // del = false: States zurücksetzen, nicht löschen
            );
        }
    }

    /**
     * Erstellt die Optionen für eine Abfahrtsanfrage.
     *
     * @param config Die Station-Konfiguration
     * @returns Die Optionen für die Abfrage
     */
    private createDepartureOptions(config: DepartureConfig): {
        results: number;
        when?: Date;
        duration: number;
        services?: string;
        client_profile?: string;
    } {
        const offsetTime = config.offsetTime ?? 0;
        const when: Date | undefined = offsetTime === 0 ? undefined : new Date(Date.now() + offsetTime * 60 * 1000);
        const duration = config.duration ?? 10;
        const results = config.numDepartures ?? 10;

        return { results, when, duration };
    }

    /**
     * Führt die Abfrage für eine Station durch.
     *
     * @param config Die Station-Konfiguration
     * @param service Der Transport-Service
     * @returns true wenn erfolgreich, false sonst
     */
    protected async queryConfig(config: DepartureConfig, service: ITransportService): Promise<boolean> {
        const options = this.createDepartureOptions(config);
        const products = config.products ?? undefined;
        const countEntries = config.numDepartures ?? 10;
        const client_profile = config.client_profile ?? undefined;
        this.adapter.log.debug(
            `id: ${config.id},
             service: ${JSON.stringify(service)},
             option: ${JSON.stringify(options)},
             countEntries: ${countEntries},
             products: ${JSON.stringify(products)},
             client_profil: ${client_profile}`,
        );

        return await this.adapter.depRequest.getDepartures(
            config.id,
            service,
            options,
            countEntries,
            products,
            client_profile,
        );
    }

    /**
     * Startet das Polling für Abfahrten.
     *
     * @param pollIntervalMinutes Das Polling-Intervall in Minuten
     */
    public async startDepartures(pollIntervalMinutes: number): Promise<void> {
        await this.start(this.adapter.config.stationConfig as DepartureConfig[], pollIntervalMinutes, {
            noConfig: 'msg_noStationsConfigured',
            noEnabled: 'msg_noEnabledStations',
            count: 'msg_activeStationsFound',
            entry: 'msg_stationListEntry',
            fetching: 'msg_fetchingDepartures',
            updated: 'msg_departuresUpdated',
            failed: 'msg_departuresUpdateFailed',
            firstCompleted: 'msg_firstQueryCompleted',
            queryCompleted: 'msg_queryCompleted',
            waiting: 'msg_waitingForNextQuery',
        });
    }
}
