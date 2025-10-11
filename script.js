const cameraView = document.getElementById('camera-view');
const overlayImage = document.querySelector('.overlay-image');
const captureButton = document.getElementById('capture-button');
const switchCameraButton = document.getElementById('switch-camera-button');
const hiddenCanvas = document.getElementById('hidden-canvas');
const ctx = hiddenCanvas.getContext('2d');
const cameraContainer = document.querySelector('.camera-container');

let currentStream;
let currentFacingMode = 'user'; // 시작을 전면 카메라('user')로 설정

async function startCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: currentFacingMode }
        });
        currentStream = stream;
        cameraView.srcObject = stream;
    } catch (err) {
        console.error("카메라 접근 실패:", err);
        alert("카메라를 사용할 수 없습니다.");
    }
}

switchCameraButton.addEventListener('click', () => {
    currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    // CSS transform을 직접 제어하여 화면에 보이는 카메라 영상만 반전시킴
    cameraView.style.transform = currentFacingMode === 'user' ? 'scaleX(-1)' : 'scaleX(1)';
    startCamera();
});

captureButton.addEventListener('click', () => {
    if (!currentStream) {
        alert("카메라가 준비되지 않았습니다.");
        return;
    }

    // 화면에 표시되는 camera-container의 실제 크기를 가져옴
    const containerWidth = cameraContainer.clientWidth;
    const containerHeight = cameraContainer.clientHeight;

    hiddenCanvas.width = containerWidth;
    hiddenCanvas.height = containerHeight;

    // 캔버스 초기화
    ctx.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);

    ctx.save(); // 현재 캔버스 상태 저장

    // 1. 카메라 영상 그리기 (컨테이너 크기에 맞춰 object-fit: cover 로직 구현)
    const videoRatio = cameraView.videoWidth / cameraView.videoHeight;
    const containerRatio = containerWidth / containerHeight;
    let sx = 0, sy = 0, sWidth = cameraView.videoWidth, sHeight = cameraView.videoHeight;
    let dx = 0, dy = 0, dWidth = containerWidth, dHeight = containerHeight;

    if (videoRatio > containerRatio) { // 비디오가 컨테이너보다 가로가 긴 경우
        sHeight = cameraView.videoHeight;
        sWidth = sHeight * containerRatio;
        sx = (cameraView.videoWidth - sWidth) / 2;
    } else { // 비디오가 컨테이너보다 세로가 긴 경우
        sWidth = cameraView.videoWidth;
        sHeight = sWidth / containerRatio;
        sy = (cameraView.videoHeight - sHeight) / 2;
    }

    // 카메라 좌우 반전 적용
    if (currentFacingMode === 'user') { // 전면 카메라일 때만
        ctx.translate(containerWidth, 0);
        ctx.scale(-1, 1);
    }

    ctx.drawImage(cameraView, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    ctx.restore(); // 캔버스 상태 복원

    // 2. PNG 프레임 그리기 (PNG 비율 유지)
    // CSS의 object-fit: contain 로직을 캔버스에 구현
    const imgNaturalRatio = overlayImage.naturalWidth / overlayImage.naturalHeight;
    let imgDrawWidth, imgDrawHeight, imgX, imgY;

    if (imgNaturalRatio > containerRatio) { // 이미지가 컨테이너보다 가로가 긴 경우
        imgDrawWidth = containerWidth;
        imgDrawHeight = containerWidth / imgNaturalRatio;
        imgX = 0;
        imgY = (containerHeight - imgDrawHeight) / 2;
    } else { // 이미지가 컨테이너보다 세로가 긴 경우
        imgDrawHeight = containerHeight;
        imgDrawWidth = containerHeight * imgNaturalRatio;
        imgX = (containerWidth - imgDrawWidth) / 2;
        imgY = 0;
    }
    ctx.drawImage(overlayImage, imgX, imgY, imgDrawWidth, imgDrawHeight);

    // 최종 이미지 다운로드
    const dataURL = hiddenCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = '산호초_복원_미션_인증샷.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    alert("사진이 갤러리에 저장되었습니다!");
});

startCamera();
