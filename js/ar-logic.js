window.addEventListener('load', function () {
    const scene = document.getElementById('ar-scene');
    const container = document.getElementById('ar-container');
    const marker = document.getElementById('ar-marker');
    const button = document.getElementById('action-button');

    // ===== 확대 문제 해결을 위한 핵심 로직 =====
    scene.addEventListener('loaded', () => {
        // AR.js의 자동 리사이즈를 기다린 후, 렌더러 크기를 강제로 재설정
        setTimeout(() => {
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;
            scene.renderer.setSize(containerWidth, containerHeight);
            console.log(`Renderer resized to: ${containerWidth}x${containerHeight}`);
        }, 100); // 0.1초 딜레이
    });

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
