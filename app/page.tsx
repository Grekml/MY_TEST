import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

export default function Page(): JSX.Element {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section id="project-b2box" className="mx-auto max-w-4xl p-6">
        <Card className="bg-white/6 border border-white/10 rounded-2xl shadow-lg">
          <CardHeader className="px-4 py-3">
            <CardTitle>B2Box</CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-3">
            <p className="text-sm text-white/90 mb-2">Проект: workspace / пользователи / доступы</p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-white/90">
              <li>GET /workspace/&#123;ws_id&#125;/user</li>
              <li>search (имя/фамилия/email/телефон), `role`, `page`, `limit`</li>
              <li>soft-delete не возвращаются</li>
              <li>проверка прав доступа к workspace</li>
              <li>пагинация + поиск</li>
              <li>быстрое тестирование + документация по результатам тестирования</li>
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-amber-600 px-3 py-1 text-sm font-medium text-white">поиск</span>
              <span className="inline-flex items-center rounded-full bg-amber-600 px-3 py-1 text-sm font-medium text-white">пагинация</span>
              <span className="inline-flex items-center rounded-full bg-amber-600 px-3 py-1 text-sm font-medium text-white">RBAC</span>
              <span className="inline-flex items-center rounded-full bg-amber-600 px-3 py-1 text-sm font-medium text-white">soft-delete</span>
            </div>
            <div className="mt-4 border-t border-white/10 pt-2 text-sm text-white/80">
              <div className="font-semibold">Моя роль / вклад</div>
              <div>Координация сбора содержания секции и согласование с дизайном</div>
            </div>
            <div className="mt-2 text-sm text-white/80">
              <span className="font-semibold">Стек / процессы</span> • Next.js, TypeScript, Tailwind CSS • локальный тестовый стенд, CI
            </div>
            <div className="mt-2 text-sm text-white/80">
              <span className="font-semibold">Подход</span> Покрытие сценариев, документация после тестирования
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
