export const fetchApi = async (
  url: string,
  methods: {
    method: string;
  },
  body?: any
) => {
  const response = await fetch(url, {
    ...methods,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "An error occurred while fetching data");
  }

  return response;
};
