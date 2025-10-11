const cameraView = document.getElementById('camera-view');
const overlayImage = document.querySelector('.overlay-image');
const captureButton = document.getElementById('capture-button');
const shareButton = document.getElementById('share-button');
const hiddenCanvas = document.getElementById('hidden-canvas');
const ctx = hiddenCanvas.getContext('2d');

let currentStream;

async function startCamera() {
    try {
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment'
                // idealWidth: 1080, // 옵션: 특정 해상도 선호
                // idealHeight: 1920 // 모바일 세로 모드 해상도
            }
        });
        currentStream = stream;
        cameraView.srcObject = stream;

        // 비디오 메타데이터가 로드되면 캔버스 크기 조정
        cameraView.onloadedmetadata = () => {
            // 비디오의 실제 해상도를 가져와 캔버스 크기 설정 (중요!)
            hiddenCanvas.width = cameraView.videoWidth;
            hiddenCanvas.height = cameraView.videoHeight;
            console.log("Canvas resized to:", hiddenCanvas.width, hiddenCanvas.height);

            // CSS로 비디오 요소의 크기가 뷰포트에 맞춰져 있어도,
            // 캔버스에는 실제 비디오 해상도로 그려져야 합니다.
            // 오버레이 이미지 크기도 캔버스 크기에 맞게 조절될 것입니다.
        };

    } catch (err) {
        console.error("카메라 접근에 실패했습니다:", err);
        alert("카메라를 사용할 수 없습니다. 브라우저 설정을 확인해주세요.");
    }
}

captureButton.addEventListener('click', () => {
    if (!cameraView.srcObject || !hiddenCanvas.width || !hiddenCanvas.height) {
        alert("카메라가 활성화되지 않았거나 준비되지 않았습니다.");
        return;
    }

    // 캔버스 초기화 (이전 프레임이 남아있을 경우 대비)
    ctx.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);

    // 캔버스에 비디오 프레임 그리기 (전체 캔버스 영역에)
    ctx.drawImage(cameraView, 0, 0, hiddenCanvas.width, hiddenCanvas.height);

    // 오버레이 이미지 그리기 (비디오와 동일한 크기로)
    ctx.drawImage(overlayImage, 0, 0, hiddenCanvas.width, hiddenCanvas.height);

    const dataURL = hiddenCanvas.toDataURL('image/png');

    const a = document.createElement('a');
    a.href = dataURL;
    a.download = '산호초_복원_미션_인증샷.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    alert("사진이 갤러리에 저장되었습니다!");
});

shareButton.addEventListener('click', async () => {
    if (!cameraView.srcObject || !hiddenCanvas.width || !hiddenCanvas.height) {
        alert("카메라가 활성화되지 않았거나 준비되지 않았습니다.");
        return;
    }

    ctx.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
    ctx.drawImage(cameraView, 0, 0, hiddenCanvas.width, hiddenCanvas.height);
    ctx.drawImage(overlayImage, 0, 0, hiddenCanvas.width, hiddenCanvas.height);

    hiddenCanvas.toBlob(async (blob) => {
        if (blob) {
            const filesArray = [
                new File([blob], '산호초_복원_인증샷.png', { type: 'image/png' })
            ];

            if (navigator.share && navigator.canShare && navigator.canShare({ files: filesArray })) {
                try {
                    await navigator.share({
                        files: filesArray,
                        title: '산호초 복원 미션 인증샷!',
                        text: '#산호초복원 #해양환경보호 #지구지킴이',
                        url: window.location.href
                    });
                    console.log('공유 성공');
                } catch (error) {
                    console.error('공유 실패:', error);
                    alert('사진 공유에 실패했습니다.');
                }
            } else {
                alert("이 기기에서는 사진을 직접 공유할 수 없습니다. '사진 저장' 버튼을 이용해 수동으로 공유해주세요.");
                console.log('Web Share API Not Supported');
            }
        } else {
            alert("이미지 생성에 실패했습니다.");
        }
    }, 'image/png');
});

startCamera();
