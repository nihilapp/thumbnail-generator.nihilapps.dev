import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Board, EditBoard } from '../types/api.types';

// api를 만듬
export const exampleApi = createApi({
  reducerPath: 'exampleApi',
  // 창에 포커싱을 새로 할 때마다 fetch를 하는게 은근 짜증이 나므로 false,
  refetchOnFocus: false,
  tagTypes: [ 'Boards', ],
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://my-json-server.typicode.com/NIHILncunia/json-server-test',
  }),
  endpoints: (builder) => ({
    // 쿼리들은 여기에 존재함.
    // 제네릭 첫 인자는 가져올 데이터의 데이터 타입, 두번째 인자는 매개변수 타입
    getBoards: builder.query<Board[], void>({
      query: () => '/boards',
      providesTags: [ 'Boards', ],
    }),
    postBoard: builder.mutation<Board, Board>({
      query: (board: Board) => ({
        url: '/boards',
        method: 'POST',
        body: board,
      }),
      invalidatesTags: [ 'Boards', ],
    }),
    editBoard: builder.mutation<Board, EditBoard>({
      query: ({ index, board, }) => ({
        url: `/boards/${index}`,
        method: 'PATCH',
        body: board,
      }),
      invalidatesTags: [ 'Boards', ],
    }),
    deleteBoard: builder.mutation<void, number>({
      query: (index) => ({
        url: `/boards/${index}`,
        method: 'DELETE',
      }),
      invalidatesTags: [ 'Boards', ],
    }),
  }),
});

// 자동으로 함수를 만들어줌.
export const {
  useGetBoardsQuery,
  usePostBoardMutation,
  useEditBoardMutation,
  useDeleteBoardMutation,
} = exampleApi;
