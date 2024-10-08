
  import { useQuery } from '@tanstack/react-query';
  import { getPulls, getRepos, getWebhooks } from '@/actions';


  export function useQueryRepo() {
    const query = useQuery({
      queryKey: [`getRepos`],
      queryFn: () => getRepos(),
      select: (data) => {
        return data.data;
      },
    });
    return query;
  }
  
  export function useQueryWebHooks(id:string) {
    const query = useQuery({
      queryKey: [`getWebhook${id}`],
      queryFn: () => getWebhooks(id),
      select: (data) => {
        return data.data;
      },
    });
    return query;
  }


  export function useQueryPulls(id:string) {
    const query = useQuery({
      queryKey: [`getPull$${id}`],
      queryFn: () => getPulls(id),
      select: (data) => {
        return data.data;
      },
    });
    return query;
  }