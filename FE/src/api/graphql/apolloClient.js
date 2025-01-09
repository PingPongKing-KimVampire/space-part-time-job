import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { IP_ADDRESS } from "./constants/constants";

const httpLink = new HttpLink({
  uri: `https://${IP_ADDRESS}/api/graphql`, // 서버의 GraphQL 엔드포인트
  credentials: "include", // 쿠키를 포함하여 요청을 보냄
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default apolloClient;
