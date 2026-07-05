import { apiFetch } from "./client";

export async function getData<T>(url: string): Promise<T> {
  return apiFetch<T>(url);
}

// export async function postData(url: string, body: RequestInit) {
//   return apiFetch(url, {
//     method: "POST",
//     body: JSON.stringify(body)
//   })
// }

// export async function putData(url: string, body: RequestInit) {
//   return apiFetch(url, {
//     method: "PUT",
//     body: JSON.stringify(body),
//   })
// }

// export async function patchData(url: string, body: RequestInit) {
//   return apiFetch(url, {
//     method: "PATCH",
//     body: JSON.stringify(body),
//   })
// }

// export async function deleteData(url, body){
//   return apiFetch(url, {
//     method: "DELETE",
//     body: JSON.stringify(body),
//   })
// }