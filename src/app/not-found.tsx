import { ButtonLink } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <p className="eyebrow text-brand-600">Ошибка 404</p>
      <h1 className="display mt-4 text-[5rem] leading-none text-brand-300 md:text-[8rem]">404</h1>
      <h2 className="display mt-2 text-3xl">Такой страницы нет</h2>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft md:text-base">Возможно, товар закончился или ссылка устарела. Загляните в каталог — там точно найдётся что-то интересное.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/catalog">В каталог</ButtonLink>
        <ButtonLink href="/" variant="outline">
          На главную
        </ButtonLink>
      </div>
    </div>
  );
}
