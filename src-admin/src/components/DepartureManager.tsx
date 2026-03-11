import { ConfigGeneric } from '@iobroker/json-config';
import { Box, Dialog } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { withConfigGeneric, type ConfigComponentProps } from './ConfigGenericWrapper';
import { defaultProducts, filterAvailableProducts, type Products } from './ProductSelector';
import StationConfig from './StationConfig';
import StationList from './StationList';
import StationSearch from './StationSearch';

interface Station {
    id: string;
    name: string;
    customName?: string;
    enabled?: boolean;
    numDepartures?: number;
    products?: Products;
    availableProducts?: Partial<Products>;
    client_profile?: string;
}

const DepartureManagerContent: React.FC<ConfigComponentProps> = ({ oContext, data, onChange, alive }) => {
    const [stations, setStations] = useState<Station[]>(() => {
        const departures = ConfigGeneric.getValue(data, 'stationConfig');
        return Array.isArray(departures) ? departures : [];
    });
    const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
    const [showSearchDialog, setShowSearchDialog] = useState(false);

    useEffect(() => {
        const departures = ConfigGeneric.getValue(data, 'stationConfig');
        if (Array.isArray(departures)) {
            setStations(departures);
        }
    }, [data]);

    const handleAddStation = useCallback((): void => {
        setShowSearchDialog(true);
    }, []);

    const handleStationSelected = useCallback(
        (stationId: string, stationName: string, availableProducts?: Partial<Products>): void => {
            const filteredProducts = filterAvailableProducts(availableProducts);

            const serviceType = ConfigGeneric.getValue(data, 'serviceType') as string;
            const profile = ConfigGeneric.getValue(data, 'profile') as string;
            const client_profile = `${serviceType || 'unknown'}:${profile || 'unknown'}`;

            const newStation: Station = {
                id: stationId,
                name: stationName,
                customName: stationName,
                enabled: true,
                numDepartures: 10,
                products: filteredProducts ? { ...filteredProducts } : { ...defaultProducts },
                availableProducts: filteredProducts,
                client_profile,
            };

            setStations(prev => {
                const exists = prev.some(s => s.id === stationId);
                if (exists) {
                    return prev;
                }
                const updated = [...prev, newStation];
                void onChange('stationConfig', updated);
                return updated;
            });

            setSelectedStationId(stationId);
            setShowSearchDialog(false);
        },
        [data, onChange],
    );

    const handleDeleteStation = useCallback(
        (stationId: string): void => {
            setStations(prev => {
                const updated = prev.filter(s => s.id !== stationId);
                void onChange('stationConfig', updated);
                return updated;
            });

            setSelectedStationId(prev => (prev === stationId ? null : prev));
        },
        [onChange],
    );

    const handleStationUpdate = useCallback(
        (stationId: string, updates: Partial<Station>): void => {
            setStations(prev => {
                const updated = prev.map(station => (station.id === stationId ? { ...station, ...updates } : station));
                void onChange('stationConfig', updated);
                return updated;
            });
        },
        [onChange],
    );

    const handleStationClick = useCallback((stationId: string): void => {
        setSelectedStationId(stationId);
    }, []);

    const handleCloseSearch = useCallback((): void => {
        setShowSearchDialog(false);
    }, []);

    const selectedStation = stations.find(s => s.id === selectedStationId) || null;

    return (
        <Box sx={{ height: '100%', p: { xs: 1, sm: 2 } }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2,
                    height: '100%',
                    width: '100%',
                }}
            >
                <Box
                    sx={{
                        width: { xs: '100%', md: 400 },
                        flexShrink: { md: 0 },
                        minHeight: { xs: 300, md: 'auto' },
                    }}
                >
                    <StationList
                        stations={stations}
                        selectedStationId={selectedStationId}
                        onAddStation={handleAddStation}
                        onDeleteStation={handleDeleteStation}
                        onStationClick={handleStationClick}
                        alive={alive}
                    />
                </Box>

                <Box
                    sx={{
                        width: { xs: '100%', md: 'calc(100% - 400px - 16px)' },
                        maxWidth: { md: '500px' },
                        flexGrow: { md: 1 },
                        minHeight: { xs: 200, md: 'auto' },
                    }}
                >
                    <StationConfig
                        station={selectedStation}
                        onUpdate={handleStationUpdate}
                        alive={alive}
                    />
                </Box>
            </Box>

            {showSearchDialog && (
                <Dialog
                    open
                    onClose={handleCloseSearch}
                    maxWidth="md"
                    fullWidth
                    fullScreen={false}
                    sx={{
                        '& .MuiDialog-paper': {
                            m: { xs: 1, sm: 2 },
                            maxHeight: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 64px)' },
                            width: { xs: 'calc(100% - 16px)', sm: 'auto' },
                        },
                    }}
                >
                    <StationSearch
                        oContext={oContext}
                        alive={alive}
                        onStationSelected={handleStationSelected}
                        onClose={handleCloseSearch}
                    />
                </Dialog>
            )}
        </Box>
    );
};

export default withConfigGeneric(DepartureManagerContent, { useRenderItem: false });
