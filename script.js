const cameraView = document.getElementById('camera-view');
const overlayImage = document.querySelector('.overlay-image');
const captureButton = document.getElementById('capture-button');
const switchCameraButton = document.getElementById('switch-camera-button');
const hiddenCanvas = document.getElementById('hidden-canvas');
const ctx = hiddenCanvas.getContext('2d');

let currentStream;
let currentFacingMode = 'user'; // 시작을 전면 카메라('user')로 설정
let isMirrored = true; // 카메라 미러링 상태 (CSS와 동일하게 true로 시작)

// 카메라 시작 및 전환 함수
async function startCamera() {
    try {
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: currentFacingMode
            }
        });

        currentStream = stream;
        cameraView.srcObject = stream;

        // 비디오 메타데이터가 로드되면 캔버스 크기 조정
        cameraView.onloadedmetadata = () => {
            hiddenCanvas.width = cameraView.videoWidth;
            hiddenCanvas.height = cameraView.videoHeight;
            console.log(`Canvas resized to: ${hiddenCanvas.width}x${hiddenCanvas.height}`);
        };

    } catch (err) {
        console.error("카메라 접근에 실패했습니다:", err);
        alert("카메라를 사용할 수 없습니다. 브라우저 설정을 확인하거나 다른 카메라를 선택해주세요.");
    }
}

// 카메라 전환 버튼 클릭 이벤트
switchCameraButton.addEventListener('click', () => {
    currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    console.log(`Switching camera to: ${currentFacingMode}`);
    // 전면 카메라일 때만 미러링 (후면은 일반적으로 미러링 안함)
    // CSS transform도 동적으로 변경할 수 있지만, 여기서는 JS에서만 조작합니다.
    // 현재는 CSS에서 전역 미러링이 적용되어 있으므로, 캔버스에 그릴 때만 조정합니다.
    isMirrored = (currentFacingMode === 'user'); // 전면 카메라일 때만 캔버스 미러링 플래그 설정
    startCamera();
});

// 사진 저장 버튼 클릭 이벤트
captureButton.addEventListener('click', () => {
    if (!cameraView.srcObject || !hiddenCanvas.width || !overlayImage.naturalWidth) {
        alert("카메라 또는 이미지가 준비되지 않았습니다.");
        return;
    }

    ctx.save(); // 현재 캔버스 상태 저장

    // 1. 카메라 영상 그리기 (미러링 적용)
    if (isMirrored) {
        ctx.translate(hiddenCanvas.width, 0); // X축 기준으로 이동
        ctx.scale(-1, 1); // X축 반전
    }
    ctx.drawImage(cameraView, 0, 0, hiddenCanvas.width, hiddenCanvas.height);
    ctx.restore(); // 캔버스 상태 복원 (이후 그리기 작업에 영향 미치지 않도록)

    // 2. 오버레이 이미지 그리기 (PNG 비율 유지)
    // object-fit: contain 로직을 JavaScript로 구현
    const imgRatio = overlayImage.naturalWidth / overlayImage.naturalHeight;
    const canvasRatio = hiddenCanvas.width / hiddenCanvas.height;

    let imgDrawWidth, imgDrawHeight, imgX, imgY;

    if (imgRatio > canvasRatio) { // 이미지가 캔버스보다 가로가 긴 경우
        imgDrawWidth = hiddenCanvas.width;
        imgDrawHeight = hiddenCanvas.width / imgRatio;
        imgX = 0;
        imgY = (hiddenCanvas.height - imgDrawHeight) / 2; // 세로 중앙 정렬
    } else { // 이미지가 캔버스보다 세로가 긴 경우 또는 비율이 같은 경우
        imgDrawHeight = hiddenCanvas.height;
        imgDrawWidth = hiddenCanvas.height * imgRatio;
        imgX = (hiddenCanvas.width - imgDrawWidth) / 2; // 가로 중앙 정렬
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

// 페이지 로드 시 카메라 시작
startCamera();
