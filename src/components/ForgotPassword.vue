const checkEmail = async () => { try { const res = await fetch(`/api/users`);
const users = await res.json(); const found = users.find( (user) =>
user.email.toLowerCase() === email.value.toLowerCase() ); if (!found) {
alert('존재하지 않는 이메일입니다.'); } else { // 6자리 랜덤 인증 코드 생성
const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
// 인증 코드를 사용자 데이터에 저장 const updateRes = await
fetch(`/api/users/${found.id}`, { method: 'PATCH', headers: { 'Content-Type':
'application/json', }, body: JSON.stringify({ ...found, verificationCode:
verificationCode, verificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000)
// 10분 후 만료 }) }); if (updateRes.ok) { // TODO: 실제 이메일 전송 로직 구현
console.log('인증 코드:', verificationCode); // 개발 중 확인용 alert('인증
코드를 보냈습니다.'); } else { throw new Error('인증 코드 저장 실패'); } } }
catch (error) { console.error(error); alert('⚠️ 오류가 발생했습니다.'); } };
