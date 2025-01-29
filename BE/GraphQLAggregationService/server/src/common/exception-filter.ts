import { Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { WooJooInternalError } from 'src/util/graphql.error';

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: any) {
    console.error('에러 필터: ', exception);
    return WooJooInternalError;
  }
}
