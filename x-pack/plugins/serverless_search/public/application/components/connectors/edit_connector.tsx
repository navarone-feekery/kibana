/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { EuiButton, EuiPageTemplate } from '@elastic/eui';
import React from 'react';
import { useParams } from 'react-router-dom';
import { i18n } from '@kbn/i18n';
import { ConnectorDefinition, CreateConnector } from '@kbn/search-connectors';
import { useKibanaServices } from '../../hooks/use_kibana';
import { useConnector } from '../../hooks/api/use_connector';
import { useConnectors } from '../../hooks/api/use_connectors';

export const EditConnector: React.FC = () => {
  const { data: connectorsData } = useConnectors();
  const isDisabled = !connectorsData?.canManageConnectors;

  const { id } = useParams<{ id: string }>();

  const {
    application: { navigateToUrl },
  } = useKibanaServices();

  const { data, isLoading } = useConnector(id);

  const selectedConnector = null;
  console.log(data);

  if (!data || isLoading) {
    <EuiPageTemplate offset={0} grow restrictWidth data-test-subj="svlSearchEditConnectorsPage">
      <EuiPageTemplate.EmptyPrompt
        title={
          <h1>
            {i18n.translate('xpack.serverlessSearch.connectors.loading', {
              defaultMessage: 'Loading',
            })}
          </h1>
        }
      />
    </EuiPageTemplate>;
  }
  if (!data?.connector) {
    return (
      <EuiPageTemplate offset={0} grow restrictWidth data-test-subj="svlSearchEditConnectorsPage">
        <EuiPageTemplate.EmptyPrompt
          title={
            <h1>
              {i18n.translate('xpack.serverlessSearch.connectors.notFound', {
                defaultMessage: 'Could not find connector {id}',
                values: { id },
              })}
            </h1>
          }
          actions={
            <EuiButton
              data-test-subj="serverlessSearchEditConnectorGoBackButton"
              color="primary"
              fill
              onClick={() => navigateToUrl(`./`)}
            >
              {i18n.translate('xpack.serverlessSearch.connectors.goBack', {
                defaultMessage: 'Go back',
              })}
            </EuiButton>
          }
        />
      </EuiPageTemplate>
    );
  }

  const { connector } = data;

  return (
    <CreateConnector
      connector={connector}
      selectedConnector={selectedConnector}
      setSelectedConnector={(c: ConnectorDefinition) => {
        console.log(c);
      }}
      currentStep={'start'}
      status={0}
      createConnector={() => {}}
      setCurrentStep={() => {}}
      updateConnectorConfiguration={() => {}}
    />
  );
};
