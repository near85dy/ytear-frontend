import { getLanguage } from "../i18n/t";

type Lang = "lv" | "en";

const localizedMessages: Record<Lang, Record<string, string>> = {
  lv: {
    "Файл не предоставлен": "Fails nav pievienots",
    "Файлы не предоставлены": "Faili nav pievienoti",
    "Медиа-файл не найден": "Multivides fails nav atrasts",
    "Вы не можете удалить этот файл": "Jūs nevarat dzēst šo failu",
    "Требуется авторизация": "Nepieciešama autorizācija",
    "Сообщество не указано": "Kopiena nav norādīta",
    "Сообщество не найдено": "Kopiena nav atrasta",
    "Вы не являетесь участником этого сообщества":
      "Jūs neesat šīs kopienas dalībnieks",
    "Недостаточно прав": "Nepietiekamu tiesību",
    "Пост не найден": "Ieraksts nav atrasts",
    "Лайк не найден": "Patika nav atrasta",
    "Пользователь не найден": "Lietotājs nav atrasts",
    "Пользователь с таким email уже существует":
      "Lietotājs ar šādu e-pastu jau pastāv",
    "Пользователь с таким именем уже существует":
      "Lietotājs ar šādu vārdu jau pastāv",
    "Неверные учётные данные": "Nepareizi pieteikšanās dati",
    "Это имя пользователя уже занято": "Šis lietotājvārds jau ir aizņemts",
    "Неверный текущий пароль": "Nepareiza pašreizējā parole",
    "Это приватное сообщество": "Šī ir privāta kopiena",
    "Вы уже поставили лайк этому посту":
      "Jūs jau atzīmējāt šo ierakstu ar patīk",
    "Сообщество с таким slug уже существует": "Kopiena ar šādu slug jau pastāv",
    "Вы уже являетесь участником": "Jūs jau esat dalībnieks",
    "Только владелец может удалить сообщество":
      "Tikai īpašnieks var dzēst kopienu",
    "Нельзя изменить роль владельца": "Īpašnieka lomu nevar mainīt",
    "Только админы могут изменять роли":
      "Tikai administratori var mainīt lomas",
    "Участник не найден": "Dalībnieks nav atrasts",
    "Вы не можете изменить роль другого админа":
      "Jūs nevarat mainīt cita administratora lomu",
    "Нельзя удалить владельца": "Īpašnieku nevar dzēst",
    "Модератор не может удалить админа":
      "Moderators nevar dzēst administratoru",
    "Недостаточно прав для приглашения": "Nepietiekamu tiesību uzaicināt",
    "Пароль успешно сброшен": "Parole veiksmīgi atiestatīta",
    "Пользователь удалён": "Lietotājs dzēsts",
    "Вы не можете редактировать этот пост": "Jūs nevarat rediģēt šo ierakstu",
    "Вы не можете удалить этот пост": "Jūs nevarat dzēst šo ierakstu",
    "Вы не можете редактировать этот комментарий":
      "Jūs nevarat rediģēt šo komentāru",
    "Вы не можете удалить этот комментарий": "Jūs nevarat dzēst šo komentāru",
    "Родительский комментарий не найден": "Vecākais komentārs nav atrasts",
    "Комментарий не найден": "Komentārs nav atrasts",
    "Некорректный email": "Nederīgs e-pasts",
    "Имя пользователя должно быть не менее 3 символов":
      "Lietotājvārdam jābūt vismaz 3 simbolus garam",
    "Имя пользователя должно быть не более 30 символов":
      "Lietotājvārdam jābūt ne garākam par 30 simboliem",
    "Имя пользователя может содержать только буквы, цифры и подчёркивание":
      "Lietotājvārds drīkst saturēt tikai burtus, ciparus un pasvītrojumu",
    "Пароль должен быть не менее 8 символов":
      "Parolei jābūt vismaz 8 simbolus garai",
    "Пароль должен содержать хотя бы одну цифру":
      "Parolei jābūt vismaz vienam ciparam",
    "Пароль должен содержать хотя бы один символ":
      "Parolei jābūt vismaz vienam simbolam",
    "Пароль должен быть не более 100 символов":
      "Parolei jābūt ne garākai par 100 simboliem",
    "Новый пароль должен быть не менее 6 символов":
      "Jaunajai parolei jābūt vismaz 6 simbolus garai",
    "Новый пароль должен быть не более 100 символов":
      "Jaunajai parolei jābūt ne garākai par 100 simboliem",
    "Неверная роль": "Nederīga loma",
    "Пост не может быть пустым": "Ieraksts nevar būt tukšs",
    "Пост должен быть не более 10000 символов":
      "Ieraksts nedrīkst būt garāks par 10000 simboliem",
    "Комментарий не может быть пустым": "Komentārs nevar būt tukšs",
    "Комментарий должен быть не более 5000 символов":
      "Komentārs nedrīkst būt garāks par 5000 simboliem",
    "Название должно быть не менее 2 символов":
      "Nosaukumam jābūt vismaz 2 simbolus garam",
    "Название должно быть не более 100 символов":
      "Nosaukumam jābūt ne garākam par 100 simboliem",
    "Slug должен быть не менее 2 символов":
      "Slug jābūt vismaz 2 simbolus garam",
    "Slug должен быть не более 50 символов":
      "Slug nedrīkst būt garāks par 50 simboliem",
    "Slug может содержать только строчные буквы, цифры, дефис и подчёркивание":
      "Slug drīkst saturēt tikai mazos burtus, ciparus, domuzīmi un pasvītrojumu",
    "Описание должно быть не более 1000 символов":
      "Apraksts nedrīkst būt garāks par 1000 simboliem",
    "Неверный тип сообщества": "Nederīgs kopienas tips",
    "Биография должна быть не более 500 символов":
      "Biogrāfija nedrīkst būt garāka par 500 simboliem",
    "Сообщество удалено": "Kopiena dzēsta",
    "Вы покинули сообщество": "Jūs pametāt kopienu",
    "Участник удалён": "Dalībnieks dzēsts",
    "Пароль успешно изменён": "Parole veiksmīgi nomainīta",
    "Пост удалён": "Ieraksts dzēsts",
    "Комментарий удалён": "Komentārs dzēsts",
  },
  en: {
    "Файл не предоставлен": "File not provided",
    "Файлы не предоставлены": "Files not provided",
    "Медиа-файл не найден": "Media file not found",
    "Вы не можете удалить этот файл": "You cannot delete this file",
    "Требуется авторизация": "Authorization required",
    "Сообщество не указано": "Community not specified",
    "Сообщество не найдено": "Community not found",
    "Вы не являетесь участником этого сообщества":
      "You are not a member of this community",
    "Недостаточно прав": "Insufficient permissions",
    "Пост не найден": "Post not found",
    "Лайк не найден": "Like not found",
    "Пользователь не найден": "User not found",
    "Пользователь с таким email уже существует":
      "A user with this email already exists",
    "Пользователь с таким именем уже существует":
      "A user with this username already exists",
    "Неверные учётные данные": "Invalid credentials",
    "Это имя пользователя уже занято": "This username is already taken",
    "Неверный текущий пароль": "Current password is incorrect",
    "Это приватное сообщество": "This is a private community",
    "Вы уже поставили лайк этому посту": "You already liked this post",
    "Сообщество с таким slug уже существует":
      "A community with this slug already exists",
    "Вы уже являетесь участником": "You are already a member",
    "Только владелец может удалить сообщество":
      "Only the owner can delete the community",
    "Нельзя изменить роль владельца": "Cannot change the owner role",
    "Только админы могут изменять роли": "Only admins can change roles",
    "Участник не найден": "Member not found",
    "Вы не можете изменить роль другого админа":
      "You cannot change another admin’s role",
    "Нельзя удалить владельца": "Cannot remove the owner",
    "Модератор не может удалить админа": "A moderator cannot remove an admin",
    "Недостаточно прав для приглашения": "Insufficient permissions to invite",
    "Пароль успешно сброшен": "Password reset successfully",
    "Пользователь удалён": "User deleted",
    "Вы не можете редактировать этот пост": "You cannot edit this post",
    "Вы не можете удалить этот пост": "You cannot delete this post",
    "Вы не можете редактировать этот комментарий":
      "You cannot edit this comment",
    "Вы не можете удалить этот комментарий": "You cannot delete this comment",
    "Родительский комментарий не найден": "Parent comment not found",
    "Комментарий не найден": "Comment not found",
    "Некорректный email": "Invalid email",
    "Имя пользователя должно быть не менее 3 символов":
      "Username must be at least 3 characters long",
    "Имя пользователя должно быть не более 30 символов":
      "Username must be at most 30 characters long",
    "Имя пользователя может содержать только буквы, цифры и подчёркивание":
      "Username may contain only letters, digits and underscore",
    "Пароль должен быть не менее 8 символов":
      "Password must be at least 8 characters long",
    "Пароль должен содержать хотя бы одну цифру":
      "Password must contain at least one digit",
    "Пароль должен содержать хотя бы один символ":
      "Password must contain at least one symbol",
    "Пароль должен быть не более 100 символов":
      "Password must be at most 100 characters long",
    "Новый пароль должен быть не менее 6 символов":
      "New password must be at least 6 characters long",
    "Новый пароль должен быть не более 100 символов":
      "New password must be at most 100 characters long",
    "Неверная роль": "Invalid role",
    "Пост не может быть пустым": "Post cannot be empty",
    "Пост должен быть не более 10000 символов":
      "Post must be at most 10000 characters long",
    "Комментарий не может быть пустым": "Comment cannot be empty",
    "Комментарий должен быть не более 5000 символов":
      "Comment must be at most 5000 characters long",
    "Название должно быть не менее 2 символов":
      "Name must be at least 2 characters long",
    "Название должно быть не более 100 символов":
      "Name must be at most 100 characters long",
    "Slug должен быть не менее 2 символов":
      "Slug must be at least 2 characters long",
    "Slug должен быть не более 50 символов":
      "Slug must be at most 50 characters long",
    "Slug может содержать только строчные буквы, цифры, дефис и подчёркивание":
      "Slug may contain only lowercase letters, digits, hyphen and underscore",
    "Описание должно быть не более 1000 символов":
      "Description must be at most 1000 characters long",
    "Неверный тип сообщества": "Invalid community type",
    "Биография должна быть не более 500 символов":
      "Bio must be at most 500 characters long",
    "Сообщество удалено": "Community deleted",
    "Вы покинули сообщество": "You left the community",
    "Участник удалён": "Member removed",
    "Пароль успешно изменён": "Password changed successfully",
    "Пост удалён": "Post deleted",
    "Комментарий удалён": "Comment deleted",
  },
};

const statusMessages: Record<Lang, Record<number, string>> = {
  lv: {
    400: "Nederīgs pieprasījums",
    401: "Nepieciešama autorizācija",
    403: "Nav piekļuves",
    404: "Nav atrasts",
    409: "Konflikts",
    500: "Servera kļūda",
  },
  en: {
    400: "Bad request",
    401: "Authorization required",
    403: "Forbidden",
    404: "Not found",
    409: "Conflict",
    500: "Server error",
  },
};

function normalizeMessage(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function extractMessages(payload: unknown): string[] {
  if (typeof payload === "string") return [payload];
  if (Array.isArray(payload)) {
    return payload.flatMap((item) => extractMessages(item));
  }
  if (payload && typeof payload === "object") {
    const message = (payload as any).message;
    if (typeof message === "string") return [message];
    if (Array.isArray(message))
      return message.flatMap((item) => extractMessages(item));
  }
  return [];
}

export function localizeServerError(payload: unknown, status?: number) {
  const lang = getLanguage() as Lang;
  const messages = extractMessages(payload);

  if (messages.length > 0) {
    return messages
      .map((message) => {
        const normalized = normalizeMessage(message);
        return localizedMessages[lang][normalized] ?? normalized;
      })
      .join("; ");
  }

  if (typeof status === "number") {
    return statusMessages[lang][status] ?? statusMessages[lang][500];
  }

  return lang === "lv" ? "Kaut kas nogāja greizi" : "Something went wrong";
}
