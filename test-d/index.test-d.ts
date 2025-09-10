import { expectType } from 'tsd';
import { Paginated, PageInfo, Result } from '../src';

type UserDto = { id: string; name: string };

const pageInfo: PageInfo = {
  page: 1,
  limit: 10,
  totalItems: 25,
  totalPages: 3,
  hasNextPage: true,
  hasPrevPage: false,
};
expectType<number>(pageInfo.totalPages);

const users: Paginated<UserDto> = { items: [], pageInfo };
expectType<Paginated<UserDto>>(users);

const rOk: Result<Paginated<UserDto>> = { ok: true, value: users };
expectType<Result<Paginated<UserDto>>>(rOk);
