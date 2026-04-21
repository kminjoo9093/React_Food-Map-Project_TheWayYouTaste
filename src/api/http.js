import { apiFetch } from "./client";

export async function getData(url) {
  return apiFetch(url);
}

export async function postData(url, body) {
  return apiFetch(url, {
    method: "POST",
    body: JSON.stringify(body)
  })
}

export async function putData(url, body) {
  return apiFetch(url, {
    method: "PUT",
    body: JSON.stringify(body),
  })
}

export async function patchData(url, body) {
  return apiFetch(url, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export async function deleteData(url, body){
  return apiFetch(url, {
    method: "DELETE",
    body: JSON.stringify(body),
  })
}