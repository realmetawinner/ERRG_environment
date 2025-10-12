window.addEventListener('load', function () {
    const marker = document.getElementById('ar-marker');
    const button = document.getElementById('action-button');

    // ===== 확대 문제 해결을 위한 최종 로직 =====
    // AR.js가 스타일을 덮어쓰는 것을 이기기 위해, 2초 동안 0.1초마다 스타일을 강제로 적용합니다.
    let counter = 0;
    const interval = setInterval(() => {
        const video = document.querySelector('video');
        if (video) {
            video.style.objectFit = 'contain';
        }
        counter++;
        if (counter > 20) { // 2초 후에는 반복을 멈춥니다.
            clearInterval(interval);
        }
    }, 100); // 0.1초 간격

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
        window.location.href = 'room2.html'; // <-- 이 부분을 원하는 페이지로 바꾸세요
    });
});
