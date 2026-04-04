import { ConfigGeneric, type ConfigGenericProps, type ConfigGenericState } from '@iobroker/json-config';
import React from 'react';

export interface ConfigComponentProps {
    oContext: ConfigGenericProps['oContext'];
    data: Record<string, any>;
    onChange: (attr: string, value: any) => Promise<void>;
    alive: boolean;
    disabled: boolean;
    onSave: (configKey: string, configValue: any) => Promise<void>;
}

/**
 * HOC that wraps a functional React component into a ConfigGeneric class,
 * as required by the ioBroker admin framework for custom config components.
 *
 * The admin framework provides the `alive` prop automatically via ConfigGeneric.
 *
 * @param Component - The functional component to wrap
 * @param options - Configuration options
 * @param options.useRenderItem - If true (default), use ConfigGeneric's renderItem pipeline
 *                                 (includes error/disabled calculation). If false, override render() directly.
 */
export function withConfigGeneric(
    Component: React.ComponentType<ConfigComponentProps>,
    options: { useRenderItem?: boolean } = {},
): React.ComponentClass<ConfigGenericProps> {
    const { useRenderItem = true } = options;

    class ConfigWrapper extends ConfigGeneric<ConfigGenericProps, ConfigGenericState> {
        private configOnChange = (attr: string, value: any): Promise<void> => {
            return this.onChange(attr, value);
        };

        private triggerSave = async (configKey: string, configValue: any): Promise<void> => {
            // Daten im Framework aktualisieren (aktiviert Save-Button)
            await new Promise<void>(resolve => this.onChange(configKey, configValue, resolve));

            // Warten bis React den aktivierten Save-Button gerendert hat
            await new Promise<void>(resolve => setTimeout(resolve, 50));

            // Save-Button programmatisch klicken → Framework speichert und setzt changed/originalData zurück
            const saveBtn = document.querySelector('[aria-label="Save"]');
            if (saveBtn instanceof HTMLElement) {
                saveBtn.click();
            }
        };

        renderItem(_error: string, disabled: boolean): React.ReactElement {
            return (
                <Component
                    oContext={this.props.oContext}
                    data={this.props.data}
                    onChange={this.configOnChange}
                    alive={this.props.alive}
                    disabled={disabled}
                    onSave={this.triggerSave}
                />
            );
        }

        render(): React.JSX.Element | string | null {
            if (!useRenderItem) {
                return (
                    <Component
                        oContext={this.props.oContext}
                        data={this.props.data}
                        onChange={this.configOnChange}
                        alive={this.props.alive}
                        disabled={false}
                        onSave={this.triggerSave}
                    />
                );
            }
            return super.render();
        }
    }

    return ConfigWrapper;
}
