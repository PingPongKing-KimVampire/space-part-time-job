function formatCurrency(number) {
  // 숫자를 문자열로 변환하고, 정규 표현식을 사용해 천 단위로 구분
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default formatCurrency;
