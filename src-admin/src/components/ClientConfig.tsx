import { I18n } from '@iobroker/adapter-react-v5';
import { ConfigGeneric } from '@iobroker/json-config';
import type { SelectChangeEvent } from '@mui/material';
import {
    Box,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import React from 'react';
import { withConfigGeneric, type ConfigComponentProps } from './ConfigGenericWrapper';

interface ServiceOption {
    value: string;
    label: string;
    serviceType: 'hafas' | 'vendo';
    profile: string;
}

const SERVICE_OPTIONS: ServiceOption[] = [
    { value: 'hafas:vbb', label: 'HAFAS - VBB (Berlin/Brandenburg)', serviceType: 'hafas', profile: 'vbb' },
    { value: 'hafas:oebb', label: 'HAFAS - ÖBB (Österreich)', serviceType: 'hafas', profile: 'oebb' },
    { value: 'vendo:db', label: 'Vendo - Deutsche Bahn', serviceType: 'vendo', profile: 'db' },
];

const ClientConfigContent: React.FC<ConfigComponentProps> = ({ data, onChange, alive, disabled }) => {
    const serviceType = ConfigGeneric.getValue(data, 'serviceType') as string;
    const profile = ConfigGeneric.getValue(data, 'profile') as string;
    const combinedValue = `${serviceType || 'hafas'}:${profile || 'vbb'}`;

    const clientName = ConfigGeneric.getValue(data, 'clientName') as string;
    const pollInterval = ConfigGeneric.getValue(data, 'pollInterval') as number;
    const logUnknownTokens = ConfigGeneric.getValue(data, 'logUnknownTokens') as boolean;
    const suppressInfoLogs = ConfigGeneric.getValue(data, 'suppressInfoLogs') as boolean;
    const delayOffset = ConfigGeneric.getValue(data, 'delayOffset') as number;

    const isDisabled = disabled || !alive;

    const handlePollIntervalChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const newValue = parseInt(event.target.value, 10);
        await onChange('pollInterval', isNaN(newValue) ? 5 : newValue);
    };

    const handleProfileChange = async (event: SelectChangeEvent<string>): Promise<void> => {
        const selected = SERVICE_OPTIONS.find(opt => opt.value === event.target.value);
        if (selected) {
            await onChange('serviceType', selected.serviceType);
            await onChange('profile', selected.profile);
        }
    };

    const handleClientNameChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        await onChange('clientName', event.target.value);
    };

    const handlelogUnknownTokensChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        await onChange('logUnknownTokens', event.target.checked);
    };

    const handleSuppressInfoLogsChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        await onChange('suppressInfoLogs', event.target.checked);
    };

    const handleDelayOffsetChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const newValue = parseInt(event.target.value, 2);
        await onChange('delayOffset', isNaN(newValue) ? 0 : newValue);
    };

    return (
        <Box sx={{ p: { xs: 1, sm: 2 }, maxWidth: 1200, mx: 'auto' }}>
            <Typography
                variant="h5"
                sx={{ mb: { xs: 2, sm: 3 }, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
            >
                {I18n.t('clientConfig_title')}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
                <FormControl
                    sx={{ flex: { sm: '1 1 0' }, minWidth: { xs: '100%', sm: 200 } }}
                    disabled={isDisabled}
                    fullWidth
                >
                    <InputLabel id="client-profile-label">{I18n.t('clientConfig_profile_label')}</InputLabel>
                    <Select
                        labelId="client-profile-label"
                        id="client-profile-select"
                        value={combinedValue}
                        label={I18n.t('clientConfig_profile_label')}
                        onChange={handleProfileChange}
                        disabled={isDisabled}
                    >
                        {SERVICE_OPTIONS.map(option => (
                            <MenuItem
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>{I18n.t('clientConfig_profile_helper')}</FormHelperText>
                </FormControl>

                <FormControl
                    sx={{ flex: { sm: '1 1 0' }, minWidth: { xs: '100%', sm: 200 } }}
                    disabled={isDisabled}
                    fullWidth
                >
                    <TextField
                        id="client-name-input"
                        label={I18n.t('clientConfig_clientName_label')}
                        value={clientName || ''}
                        onChange={handleClientNameChange}
                        helperText={I18n.t('clientConfig_clientName_helper')}
                        disabled={isDisabled}
                        fullWidth
                    />
                </FormControl>
            </Box>
            <Typography
                variant="h5"
                sx={{ mb: { xs: 2, sm: 3 }, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
            >
                {I18n.t('settings_title')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
                <FormControl
                    sx={{ flex: { sm: '1 1 0' }, minWidth: { xs: '100%', sm: 200 } }}
                    disabled={isDisabled}
                    fullWidth
                >
                    <TextField
                        label={I18n.t('clientConfig_pollInterval_label')}
                        type="number"
                        value={pollInterval || 0}
                        onChange={handlePollIntervalChange}
                        fullWidth
                        size="small"
                        slotProps={{ htmlInput: { min: 5, step: 1, max: 60 } }}
                        helperText={I18n.t('clientConfig_pollInterval_helper')}
                        disabled={isDisabled}
                    />
                </FormControl>

                <FormControl
                    sx={{ flex: { sm: '1 1 0' }, minWidth: { xs: '100%', sm: 200 } }}
                    disabled={isDisabled}
                >
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={logUnknownTokens || false}
                                onChange={handlelogUnknownTokensChange}
                                disabled={isDisabled}
                            />
                        }
                        label={I18n.t('clientConfig_logUnknownTokens_label')}
                    />
                    <FormHelperText>{I18n.t('clientConfig_logUnknownTokens_helper')}</FormHelperText>
                </FormControl>

                <FormControl
                    sx={{ flex: { sm: '1 1 0' }, minWidth: { xs: '100%', sm: 200 } }}
                    disabled={isDisabled}
                >
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={suppressInfoLogs || false}
                                onChange={handleSuppressInfoLogsChange}
                                disabled={isDisabled}
                            />
                        }
                        label={I18n.t('clientConfig_suppressInfoLogs_label')}
                    />
                    <FormHelperText>{I18n.t('clientConfig_suppressInfoLogs_helper')}</FormHelperText>
                </FormControl>

                <FormControl
                    sx={{ flex: { sm: '1 1 0' }, minWidth: { xs: '100%', sm: 200 } }}
                    disabled={isDisabled}
                    fullWidth
                >
                    <TextField
                        label={I18n.t('clientConfig_delayOffset_label')}
                        type="number"
                        value={delayOffset || 2}
                        onChange={handleDelayOffsetChange}
                        fullWidth
                        size="small"
                        slotProps={{ htmlInput: { min: 5, step: 1, max: 60 } }}
                        helperText={I18n.t('clientConfig_delayOffset_helper')}
                        disabled={isDisabled}
                    />
                </FormControl>
            </Box>
        </Box>
    );
};

export default withConfigGeneric(ClientConfigContent);
