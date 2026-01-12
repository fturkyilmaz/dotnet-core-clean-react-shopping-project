import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";

export const use${NAME}s = () =>
  useQuery({
    queryKey: ["${LOWER}s"],
    queryFn: async () => (await axios.get("/api/${LOWER}s")).data,
  });

export const useCreate${NAME} = () =>
  useMutation({
    mutationFn: (data: any) =>
      axios.post("/api/${LOWER}s", data),
  });
