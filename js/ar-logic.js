window.addEventListener('load', function () {
    const marker = document.getElementById('ar-marker');
    const button = document.getElementById('action-button');

    // 이벤트: 카메라가 마커(타겟)를 찾았을 때
    marker.addEventListener('markerFound', function() {
        console.log('타겟을 찾았습니다!');
        button.style.display = 'block'; // 버튼을 보여줌
    });

    // ===== 이 부분을 수정합니다 =====
    // 이벤트: 카메라가 마커(타겟)를 놓쳤을 때
    // 이 부분을 주석 처리하여 버튼이 사라지지 않도록 합니다.
    /*
    marker.addEventListener('markerLost', function() {
        console.log('타겟을 놓쳤습니다.');
        button.style.display = 'none'; // 버튼을 다시 숨김
    });
    */

    // 이벤트: HTML 버튼이 클릭되었을 때
    button.addEventListener('click', function() {
        console.log('버튼이 클릭되었습니다!');
        // 지정된 페이지로 이동
        window.location.href = 'room2.html'; // <-- 이 부분을 원하는 페이지로 바꾸세요
    });
});
