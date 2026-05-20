import { createClient } from '@motis-project/motis-fptf-client';
import { profile as compatProfile } from '@motis-project/motis-fptf-client/p/compat/index.js';
import { withThrottling } from '@motis-project/motis-fptf-client/throttle.js';
import type * as Hafas from 'hafas-client';
import type { ITransportService } from '../types/transportService';

export class MotisService implements ITransportService {
    private client: ReturnType<typeof createClient> | null = null;
    private clientName: string;

    constructor(clientName: string) {
        this.clientName = clientName;
    }

    public init(): boolean {
        try {
            // enrichStations deaktiviert, um das Laden von db-hafas-stations zu vermeiden
            const profile = { ...compatProfile, enrichStations: false };
            this.client = createClient(withThrottling(profile), this.clientName);
            return true;
        } catch (error) {
            throw new Error(`The MOTIS client could not be initialized: ${(error as Error).message}`);
        }
    }

    public isInitialized(): boolean {
        return this.client !== null;
    }

    private getClient(): ReturnType<typeof createClient> {
        if (!this.client) {
            throw new Error('MotisService has not been initialized yet. Please call init() first.');
        }
        return this.client;
    }

    async getLocations(
        query: string,
        options?: Hafas.LocationsOptions,
    ): Promise<ReadonlyArray<Hafas.Station | Hafas.Stop | Hafas.Location>> {
        return this.getClient().locations(query, options);
    }

    async getDepartures(stationId: string, options?: Hafas.DeparturesArrivalsOptions): Promise<Hafas.Departures> {
        return this.getClient().departures(stationId, options);
    }

    async getJourneys(fromId: string, toId: string, options?: Hafas.JourneysOptions): Promise<Hafas.Journeys> {
        return this.getClient().journeys(fromId, toId, options);
    }

    async getStop(
        stationId: string,
        options?: Hafas.StopOptions,
    ): Promise<Hafas.Station | Hafas.Stop | Hafas.Location> {
        return this.getClient().stop(stationId, options);
    }
}
