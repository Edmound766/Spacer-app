import { apiSlice } from "@features/api/apiSlice";

export type Space = {
  availability: boolean;
  id: number;
  name: string;
  owner_name: string;
};

const spacesSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSpaces: builder.query<Space[], void>({
      query: () => "/spaces",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      providesTags: (result = [],_error, _arg) => [
        "Space",
        ...result.map(({ id }) => ({ type: "Space", id } as const)),
      ],
    }),
    getSpace: builder.query<Space, number>({
      query: (spaceId) => `/spaces/${spaceId}`,
      providesTags:(_result,_error,arg)=>[
        {type:"Space",id:arg}
      ]
    }),
  }),
});

export const { useGetSpacesQuery } = spacesSlice;
