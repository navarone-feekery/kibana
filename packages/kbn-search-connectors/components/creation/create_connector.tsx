/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useState, FC, PropsWithChildren } from 'react';

import { css } from '@emotion/react';

import {
  EuiBadge,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiLink,
  EuiPageTemplate,
  EuiPanel,
  EuiSpacer,
  EuiSteps,
  EuiSuperSelect,
  EuiText,
  useEuiTheme,
} from '@elastic/eui';

import { i18n } from '@kbn/i18n';

import { EuiContainedStepProps } from '@elastic/eui/src/components/steps/steps';
import { FormattedMessage } from '@kbn/i18n-react';
// import { ConnectorDefinition } from '@kbn/search-connectors/types/connector_definition';
import { generateStepState } from '../../utils/generate_step_state';
import { Connector, ConnectorDefinition, SelfManagePreference } from '../..';
// import { CreateConnectorStep } from './create_connector_step';
// import { DeploymentStep } from './deployment_step';
import { StartStep } from './start_step';

export enum Status {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR,
}

type ConnectorCreationSteps = 'start' | 'deployment' | 'configure' | 'finish';

interface CreateConnectorProps {
  connector: Connector;
  selectedConnector: ConnectorDefinition | null;
  setSelectedConnector: Function;
  currentStep: ConnectorCreationSteps;
  status: number;
  createConnector: (connectorParams: Record<string, string | number | boolean | null>) => void;
  setCurrentStep: (step: Record<string, string | number | boolean | null>) => void;
  updateConnectorConfiguration: (
    configuration: Record<string, string | number | boolean | null>,
    connectorId: string
  ) => void;
}

export const CreateConnector: FC<PropsWithChildren<CreateConnectorProps>> = ({
  children,
  connector,
  selectedConnector,
  setSelectedConnector,
  currentStep,
  status,
  createConnector,
  setCurrentStep,
  updateConnectorConfiguration,
}) => {
  // const { error } = useValues(AddConnectorApiLogic);
  const { euiTheme } = useEuiTheme();
  const [selfManagePreference, setSelfManagePreference] = useState<SelfManagePreference>('native');

  // const { selectedConnector, currentStep } = useValues(NewConnectorLogic);
  // const { setCurrentStep } = useActions(NewConnectorLogic);
  const stepStates = generateStepState(currentStep);

  // useEffect(() => {
  //   // TODO: separate this to ability and preference
  //   if (!connector?.is_native || !selfManagePreference) {
  //     setSelfManagePreference('selfManaged');
  //   } else {
  //     setSelfManagePreference('native');
  //   }
  // }, [connector, selfManagePreference]);

  const getSteps = (selfManaged: boolean): EuiContainedStepProps[] => {
    return [
      {
        children: null,
        status: stepStates.start,
        title: i18n.translate('xpack.enterpriseSearch.createConnector.startStep.startLabel', {
          defaultMessage: 'Start',
        }),
      },
      ...(selfManaged
        ? [
            {
              children: null,
              status: stepStates.deployment,
              title: i18n.translate(
                'xpack.enterpriseSearch.createConnector.deploymentStep.deploymentLabel',
                { defaultMessage: 'Deployment' }
              ),
            },
          ]
        : []),
      {
        children: null,
        status: stepStates.configure,
        title: i18n.translate(
          'xpack.enterpriseSearch.createConnector.configurationStep.configurationLabel',
          { defaultMessage: 'Configuration' }
        ),
      },

      {
        children: null,
        status: stepStates.finish,
        title: i18n.translate('xpack.enterpriseSearch.createConnector.finishUpStep.finishUpLabel', {
          defaultMessage: 'Finish up',
        }),
      },
    ];
  };

  const stepContent: Record<'start' | 'deployment' | 'configure' | 'finish', React.ReactNode> = {
    configure: <></>,
    deployment: <></>,
    finish: <></>,
    start: (
      <StartStep
        connector={connector}
        selectedConnector={selectedConnector}
        setSelectedConnector={setSelectedConnector}
        error={''}
        // error={errorToText(error)}
        title={i18n.translate('xpack.enterpriseSearch.createConnector.startStep.startLabel', {
          defaultMessage: 'Start',
        })}
        selfManagePreference={selfManagePreference}
        setCurrentStep={setCurrentStep}
        onSelfManagePreferenceChange={(preference) => {
          setSelfManagePreference(preference);
        }}
      />
    ),
  };

  return (
    <EuiPageTemplate offset={0} grow restrictWidth data-test-subj="svlSearchConnectorsPage">
      <EuiPageTemplate.Header
        pageTitle={i18n.translate('xpack.serverlessSearch.connectors.title', {
          defaultMessage: 'Create a connector',
        })}
        data-test-subj="serverlessSearchConnectorsTitle"
        restrictWidth
      >
        <EuiText>
          <p>
            <FormattedMessage
              id="xpack.serverlessSearch.connectors.headerContent"
              defaultMessage="Extract, transform, index and sync data from a third-party data source."
            />
          </p>
        </EuiText>
      </EuiPageTemplate.Header>
      <EuiPageTemplate.Section restrictWidth color="subdued">
        <EuiFlexGroup gutterSize="m">
          {/* Col 1 */}
          <EuiFlexItem grow={2}>
            <EuiPanel
              hasShadow={false}
              hasBorder
              color="subdued"
              paddingSize="l"
              css={css`
                ${currentStep === 'start'
                  ? // TODO: fix ? `background-image: url(${connectorsBackgroundImage});`
                    ''
                  : ''}
                background-size: contain;
                background-repeat: no-repeat;
                background-position: bottom center;
                min-height: 550px;
                border: 1px solid ${euiTheme.colors.lightShade};
              `}
            >
              <EuiSteps
                titleSize="xxs"
                steps={getSteps(selfManagePreference === 'selfManaged')}
                css={() => css`
                  .euiStep__content {
                    padding-block-end: ${euiTheme.size.xs};
                  }
                `}
              />
              <EuiSpacer size="xl" />
              {selectedConnector?.docsUrl && selectedConnector?.docsUrl !== '' && (
                <>
                  <EuiText size="s">
                    <p>
                      <EuiLink
                        external
                        data-test-subj="enterpriseSearchCreateConnectorConnectorDocsLink"
                        href={selectedConnector?.docsUrl}
                        target="_blank"
                      >
                        {'Elastic '}
                        {selectedConnector?.name}
                        {i18n.translate(
                          'xpack.enterpriseSearch.createConnector.connectorDocsLinkLabel',
                          { defaultMessage: ' connector reference' }
                        )}
                      </EuiLink>
                    </p>
                  </EuiText>
                  <EuiSpacer size="s" />
                </>
              )}
              {currentStep !== 'start' && (
                <>
                  <EuiFormRow
                    label={i18n.translate(
                      'xpack.enterpriseSearch.createConnector.euiFormRow.connectorLabel',
                      { defaultMessage: 'Connector' }
                    )}
                  >
                    <EuiSuperSelect
                      readOnly
                      valueOfSelected="item1"
                      options={[
                        {
                          inputDisplay: (
                            <>
                              {/* <EuiIcon
                              size="l"
                              type={selectedConnector?.iconPath ?? ''}
                              css={css`
                                margin-right: ${euiTheme.size.m};
                              `}
                            />
                            {selectedConnector?.name} */}
                            </>
                          ),
                          value: 'item1',
                        },
                      ]}
                    />
                  </EuiFormRow>
                  <EuiSpacer size="s" />
                  <EuiBadge color="hollow">
                    {selfManagePreference
                      ? i18n.translate(
                          'xpack.enterpriseSearch.createConnector.badgeType.selfManaged',
                          {
                            defaultMessage: 'Self managed',
                          }
                        )
                      : i18n.translate(
                          'xpack.enterpriseSearch.createConnector.badgeType.ElasticManaged',
                          {
                            defaultMessage: 'Elastic managed',
                          }
                        )}
                  </EuiBadge>
                </>
              )}
            </EuiPanel>
          </EuiFlexItem>
          {/* Col 2 */}
          <EuiFlexItem grow={7}>{stepContent[currentStep]}</EuiFlexItem>
        </EuiFlexGroup>
      </EuiPageTemplate.Section>
    </EuiPageTemplate>
  );
};
