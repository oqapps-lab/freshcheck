# Smoke-test: Универсальный полный проход — 2026-06-22

## Итог

Пройдено: Home → Fridge (фильтры) → Recipes (From your fridge, Recipe Builder) → Profile → Auth → Scan → Paywall

---

## Баги

### B01: Текст под таббаром (Fridge + Home)
Где: Вкладка Fridge при начальной загрузке и при фильтрации; вкладка Home в секции STORAGE GUIDE  
Что вижу: Текст категорий ("PRODUCE", "DAYS", "Bananas", "Berries", "Tomatoes") просачивается под таббар — виден в области жестовой навигации под иконками  
Как должно быть: Контент должен заканчиваться выше таббара, либо таббар должен обрезать контент за собой  
Скриншоты: screenshots/02-fridge.png, screenshots/19-home-tips.png, screenshots/22-fridge-filter-dairy.png  
Приоритет: MEDIUM  
Статус: ОТКРЫТ (был в предыдущих сессиях, не исправлен)

### B02: Backend недоступен — Scan
Где: Экран SCAN после нажатия на орб сканирования  
Что вижу: "Service unavailable — Scanning is temporarily unavailable. Please try again in a moment."  
Примечание: Сообщение изменилось с "Backend unavailable" на "Service unavailable" — возможно, улучшен текст ошибки  
Скриншот: screenshots/12-scan-camera.png  
Приоритет: HIGH  
Статус: ОТКРЫТ

### B03: Backend недоступен — Recipe generation
Где: Recipes → From your fridge → Generate; Recipes → From your ingredients → Generate recipes  
Что вижу: "Couldn't generate recipes — Backend not configured" (From your fridge); "Could not generate — Backend not configured" (Recipe Builder)  
Скриншоты: screenshots/06-recipes-generated.png, screenshots/15-recipe-builder-result.png  
Приоритет: HIGH  
Статус: ОТКРЫТ (тот же бэкенд что и для сканирования)

---

## Исправления подтверждены

- ✅ Auth — пароль показывает точки (•••): поле PASSWORD скрывает ввод корректно
- ✅ Profile — имя "Alex" отображается без проблем с лейаутом
- ✅ Profile — GUEST статус показывается корректно под именем
- ✅ Paywall — hardware back возвращает на Profile (ранее был баг HIGH)
- ✅ Paywall — X-кнопка появляется при скролле и закрывает экран
- ✅ Paywall — бейдж "THE AVERAGE HOUSEHOLD SAVES $2,913 / YEAR" (не "FAMILY")
- ✅ Paywall — все цены видны и не обрезаются (Annual $39.99, Monthly $14.99, Weekly $6.99)
- ✅ Fridge — фильтр по категориям работает (Produce, Dairy, Poultry)
- ✅ Recipe Builder — поле ввода принимает текст, кнопка + добавляет чипы, Generate активируется при наличии ингредиентов

---

## Чисто (без багов)

- Home tab: "Ready to Scan" экран, орб, "RECIPE OF THE DAY", "FRESH TIPS" — всё отображается
- Fridge tab: список продуктов с иконками, процент-барами, сортировка по сроку годности
- Recipes tab: две карточки ("From your fridge", "From your ingredients") — всё читается
- Recipe Builder: все поля, чипы юнитов (G/PCS/CUPS/TBSP/TSP/ML), методы готовки, MAX TIME
- Profile: имя, аватар с кнопкой +, счётчик ITEMS IN FRIDGE, Sign in, Upgrade to Pro, Notifications, Language, About, Version 0.2.0
- Auth screen: поля EMAIL и PASSWORD, Sign in, Sign up, Continue as Guest — всё на месте

---

## Версия приложения

0.2.0 (exposdk:55.0.0)
