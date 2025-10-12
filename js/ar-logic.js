window.addEventListener('load', function () {
    const marker = document.getElementById('ar-marker');
    const button = document.getElementById('action-button');

    // 이벤트: 카메라가 마커(타겟)를 찾았을 때
    marker.addEventListener('markerFound', function() {
        console.log('타겟을 찾았습니다!');
        button.style.display = 'block';
    });

    // 이벤트: 카메라가 마커(타겟)를 놓쳤을 때
    marker.addEventListener('markerLost', function() {
        console.log('타겟을 놓쳤습니다.');
        button.style.display = 'none';
    });

    // 이벤트: HTML 버튼이 클릭되었을 때
    button.addEventListener('click', function() {
        console.log('버튼이 클릭되었습니다!');
        // 원하는 페이지로 이동
        window.location.href = 'room2.html'; 
    });
});
