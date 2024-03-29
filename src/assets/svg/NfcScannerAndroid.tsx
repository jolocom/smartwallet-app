import * as React from 'react'
import Svg, { SvgProps, G, Ellipse, Path, Rect } from 'react-native-svg'

function NfcScannerAndroid(props: SvgProps) {
  return (
    <Svg
      width={'100%'}
      height={'100%'}
      viewBox="0 0 156 156"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G fill="none" fillRule="evenodd">
        <Ellipse
          stroke="#FFF"
          strokeWidth={2}
          fill="#373737"
          cx={77.805}
          cy={78}
          rx={76.805}
          ry={77}
        />
        <G transform="translate(12.593 30.982)" stroke="#FFF">
          <Path
            d="M9.894 28.983C3.298 40.105 0 47.32 0 50.625c0 3.306.734 14.592 2.2 33.858l-.785 6.41 19.907 19.125"
            strokeWidth={1.579}
            fill="#1F1F1F"
            strokeLinecap="square"
          />
          <Rect
            strokeWidth={1.579}
            fill="#0084FF"
            x={10.084}
            y={0.79}
            width={75.415}
            height={44.36}
            rx={4.212}
          />
          <Path
            d="M9.82 66.672c1.643-4.573 2.683-7.733 3.12-9.477 1.969-7.87-.446-8.425 1.783-14.743 1.475-4.184 6.19-14.977 6.685-15.27 3.106-1.835 6.078 3.92 6.24 9.478.072 2.459-1.678 7.214-2.229 12.637-.431 4.25 1.337 10.38 1.337 21.588 0 6.845-3.377 6.923-5.348 13.163-.407 1.289-.407 3.57 0 6.845l-.05 19.094"
            strokeWidth={1.579}
            fill="#1F1F1F"
            strokeLinecap="square"
          />
          <Path
            d="M60.917 11.717c3.502 3.915 5.253 8.074 5.253 12.478 0 4.403-1.751 8.318-5.253 11.743"
            strokeWidth={1.8}
            strokeLinecap="square"
          />
          <Path
            d="M58.834 16.983c2.089 2.227 3.134 4.557 3.134 6.99 0 2.44-1.05 4.673-3.152 6.7m-2.393-9.629c1.192 1.028 1.789 2.103 1.789 3.226 0 1.126-.6 2.157-1.8 3.092"
            strokeWidth={1.8}
            strokeLinecap="square"
          />
        </G>
        <G transform="translate(69.7 22.724)">
          <Path
            d="M54.706 57.713c5.403 6.23 9.456 11.24 12.157 15.032 2.702 3.791 1.112 15.87-4.769 36.236l-.094.732c-3.907 4.17-6.91 7.023-9.008 8.563-2.098 1.54-5.257 3.206-9.476 5"
            stroke="#FFF"
            strokeWidth={1.579}
            fill="#1F1F1F"
            strokeLinecap="square"
          />
          <Path
            d="M23.128 7.35a6.552 6.552 0 013.062-3.997 6.558 6.558 0 014.993-.66l31.562 8.47a6.572 6.572 0 013.995 3.07 6.571 6.571 0 01.66 4.993L46.943 95.661a6.552 6.552 0 01-3.062 3.997 6.558 6.558 0 01-4.993.659l-31.562-8.47a6.572 6.572 0 01-3.995-3.07 6.571 6.571 0 01-.661-4.993z"
            stroke="#FFF"
            strokeWidth={1.579}
            fill="#1F1F1F"
          />
          <Path
            d="M57.626 88.704c-1.718-4.58-2.806-7.745-3.262-9.493-2.058-7.882.466-8.438-1.864-14.766-1.543-4.191-6.47-15-6.99-15.294-3.246-1.838-6.353 3.927-6.523 9.493-.075 2.462 1.754 7.225 2.33 12.657.452 4.257-1.398 10.397-1.398 21.622 0 6.856 3.53 6.934 5.592 13.184.426 1.291.426 3.577 0 6.856l-1.746 10.563"
            stroke="#FFF"
            strokeWidth={1.579}
            fill="#1F1F1F"
            strokeLinecap="square"
          />
          <Ellipse
            stroke="#FFF"
            fill="#1F1F1F"
            cx={24.96}
            cy={87.649}
            rx={4.241}
            ry={4.246}
          />
          <Path
            d="M40.877 9.418l11.142 3.199c.559.16.882.743.722 1.302l-.086.302a1.052 1.052 0 01-1.302.722L40.21 11.744a1.055 1.055 0 01-.722-1.303l.086-.301a1.052 1.052 0 011.303-.722z"
            fill="#FFF"
          />
        </G>
      </G>
    </Svg>
  )
}

export default NfcScannerAndroid
