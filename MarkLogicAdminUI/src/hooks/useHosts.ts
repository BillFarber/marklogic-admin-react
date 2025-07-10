import { useState, useEffect } from 'react';
import type { HostListResponse, HostDetailsMap } from '../types/marklogic';

interface UseHostsReturn {
  hosts: HostListResponse | null;
  hostDetails: HostDetailsMap;
  loading: boolean;
  error: string | null;
}

export function useHosts(): UseHostsReturn {
  const [hosts, setHosts] = useState<HostListResponse | null>(null);
  const [hostDetails, setHostDetails] = useState<HostDetailsMap>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const hostsUrl = 'http://localhost:8080/manage/v2/hosts?format=json';

        const response = await fetch(hostsUrl, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setHosts(data);

        // Fetch details for each host using nameref (host name)
        if (
          data &&
          Array.isArray(
            data['host-default-list']?.['list-items']?.['list-item'],
          )
        ) {
          const hostList = data['host-default-list']['list-items']['list-item'];
          const details: Record<string, any> = {};

          // Fetch details for each host in parallel
          const detailPromises = hostList
            .filter((host: any) => host.nameref)
            .map(async (host: any) => {
              try {
                const detailUrl = `http://localhost:8080/manage/v2/hosts/${host.nameref}/properties?format=json`;
                const detailResponse = await fetch(detailUrl, {
                  method: 'GET',
                  headers: { Accept: 'application/json' },
                });

                if (detailResponse.ok) {
                  const detailData = await detailResponse.json();
                  return {
                    hostKey: host.idref || host.nameref,
                    data: detailData,
                  };
                } else {
                  console.warn(
                    `Failed to fetch details for host ${host.nameref}: ${detailResponse.status}`,
                  );
                  return null;
                }
              } catch (err) {
                console.warn(
                  `Error fetching details for host ${host.nameref}:`,
                  err,
                );
                return null;
              }
            });

          const detailResults = await Promise.all(detailPromises);
          detailResults.forEach((result) => {
            if (result) {
              details[result.hostKey] = result.data;
            }
          });

          setHostDetails(details);
        }
      } catch (err) {
        console.error('Error fetching hosts:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHosts();
  }, []);

  return {
    hosts,
    hostDetails,
    loading,
    error,
  };
}
