export function formatPrice(price){
    if (!price) return "0원";
    return price.toLocaleString("ko-KR") + "원";
}