export const getCookieByName = (cookie: string, name: string) => {
  const value = `; ${cookie}`;
  const parts = value.split(`; ${name}=`)
  if (parts.length == 2) return parts.pop()?.split(";").shift()

}