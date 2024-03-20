import { Card, Text, Avatar, Flex, Box } from '@radix-ui/themes';
import type { SearchResult } from '~/services/serpapi';
import Skeleton from 'react-loading-skeleton';

type ResultCardProps =
  | { loading: true; result?: never }
  | { loading: false; result: SearchResult };

export const ResultCard: React.FC<ResultCardProps> = (props) => {
  if (props.loading) {
    return (
      <Card size="2" style={{ width: 425, height: '100%' }} className="Card">
        <Flex gap="4" align="center">
          <Avatar size="2" radius="full" fallback="..." />
          <Box>
            <Skeleton width="80%" />
            <Skeleton width="90%" />
            <Skeleton width={300} />
          </Box>
        </Flex>
      </Card>
    );
  } else {
    const { result } = props;
    return (
      <a href={result.link} target="_blank" rel="noopener noreferrer">
        <Card size="2" style={{ width: 425, height: '100%' }} className="Card">
          <Flex gap="4" align="center">
            <Avatar
              size="2"
              radius="full"
              fallback="J"
              src={result.favicon}
              color="indigo"
            />
            <Box>
              <Text as="div">{result.snippet}</Text>
            </Box>
          </Flex>
        </Card>
      </a>
    );
  }
};
