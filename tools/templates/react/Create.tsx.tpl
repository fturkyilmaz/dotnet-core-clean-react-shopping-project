import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreate${NAME} } from "./api";
import { Guard } from "@/lib/Guard";
import { useTranslation } from "react-i18next";

const schema = z.object({
  name: z.string().min(1),
});

export const ${NAME}Create = () => {
  const { t } = useTranslation("${LOWER}");
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const create = useCreate${NAME}();

  return (
    <form onSubmit={form.handleSubmit(data => create.mutate(data))}>
      <input {...form.register("name")} />
      
      <Guard can="${LOWER}:create">
        <button type="submit">{t("create")}</button>
      </Guard>
    </form>
  );
};
