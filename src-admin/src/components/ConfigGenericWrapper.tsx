import { ConfigGeneric, type ConfigGenericProps, type ConfigGenericState } from '@iobroker/json-config';
import React from 'react';

export interface ConfigComponentProps {
    oContext: ConfigGenericProps['oContext'];
    data: Record<string, any>;
    onChange: (attr: string, value: any) => Promise<void>;
    alive: boolean;
    disabled: boolean;
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
): React.ComponentClass {
    const { useRenderItem = true } = options;

    class ConfigWrapper extends ConfigGeneric<ConfigGenericProps, ConfigGenericState> {
        private configOnChange = (attr: string, value: any): Promise<void> => {
            return this.onChange(attr, value);
        };

        renderItem(_error: string, disabled: boolean): React.ReactElement {
            return (
                <Component
                    oContext={this.props.oContext}
                    data={this.props.data}
                    onChange={this.configOnChange}
                    alive={this.props.alive}
                    disabled={disabled}
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
                    />
                );
            }
            return super.render();
        }
    }

    return ConfigWrapper as any;
}
