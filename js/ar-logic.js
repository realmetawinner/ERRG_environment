window.addEventListener('load', function () {
    const scene = document.querySelector('a-scene');
    const marker = document.getElementById('ar-marker');
    const button = document.getElementById('action-button');
    
    // 오버레이 이미지를 담을 엔티티를 찾습니다.
    const overlayEntity = marker.querySelector('a-image'); 

    // A-Frame의 렌더링 루프(tick)를 사용하여 매 프레임마다 실행
    scene.addEventListener('tock', function() {
        if (marker.object3D.visible) {
            // 마커가 보일 때, 오버레이 이미지의 월드 회전 값을 0으로 고정합니다.
            overlayEntity.object3D.rotation.set(0, 0, 0);
        }
    });

    // 이벤트: 카메라가 마커(타겟)를 찾았을 때
    marker.addEventListener('markerFound', function() {
        console.log('타겟을 찾았습니다!');
        button.style.display = 'block';
    });
    
    // 이벤트: HTML 버튼이 클릭되었을 때
    button.addEventListener('click', function() {
        console.log('버튼이 클릭되었습니다!');
        // 지정된 페이지로 이동
        window.location.href = 'room2.html'; // <-- 이 부분을 원하는 페이지로 바꾸세요
    });
    
    // 버튼이 한번 나타나면 사라지지 않도록 markerLost 이벤트는 주석 처리합니다.
    /*
    marker.addEventListener('markerLost', function() {
        console.log('타겟을 놓쳤습니다.');
        button.style.display = 'none';
    });
    */
});
