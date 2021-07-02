import * as React from 'react'
import { View } from 'react-native'
import Svg, { Defs, Path, G, Use, Line, Rect, Polygon } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: title, filter */

const SvgComponent: React.FC = ({ children }) => {
  return (
    <View style={{ aspectRatio: 369 / 232 }}>
      <Svg width={'100%'} height={'100%'} viewBox="0 0 369 232">
        <Defs>
          <Path
            id="path-1"
            d="m225.4,0c4.19736,0 7.6,3.40264 7.6,7.6l0.00066,82.13324c-4.85427,1.1849 -8.47335,5.78585 -8.47335,11.28099c0,5.49515 3.61908,10.0961 8.47335,11.281l-0.00066,249.10477c0,4.19736 -3.40264,7.6 -7.6,7.6l-217.79906,0c-4.19736,0 -7.6,-3.40264 -7.6,-7.6l-0.00103,-249.63247c4.61696,-1.41177 7.9961,-5.95372 7.9961,-11.33866c0,-5.38495 -3.37914,-9.9269 -7.9961,-11.33867l0.00103,-81.4902c0,-4.19736 3.40264,-7.6 7.6,-7.6l217.79906,0z"
          />
        </Defs>
        <G>
          <G fillRule="evenodd" fill="none" id="Camera">
            <G id="Group-16">
              <G
                transform="matrix(0, 0.993294, -0.998306, 0, 485.061, -183.253)"
                id="Group-4"
              >
                <G id="receipt-card">
                  <G id="Combined-Shape">
                    <Use
                      id="svg_1"
                      x={184.68749}
                      y={116.69635}
                      xlinkHref="#path-1"
                      filter="url(#filter-2)"
                      fill="black"
                    />
                    <Use
                      id="svg_2"
                      x={184.68749}
                      y={116.69635}
                      xlinkHref="#path-1"
                      fillRule="evenodd"
                      fill="#FFFFFF"
                    />
                  </G>
                  <Line
                    strokeDasharray="1.279999847412114,2.559999694824228"
                    strokeLinecap="square"
                    opacity={0.30499}
                    strokeWidth={0.64}
                    stroke="#6F7FAF"
                    id="Line-2"
                    y2={217.19635}
                    x2={393.18749}
                    y1={217.19635}
                    x1={209.18749}
                  />
                </G>
                <G fillRule="nonzero" fill="#000000" id="Group-5">
                  <G id="001-barcode">
                    <Rect
                      height={40.40816}
                      width={1.81444}
                      y={140.69635}
                      x={221.68749}
                      id="Rectangle"
                    />
                    <Polygon
                      points="227.13082885742188,140.69635009765625 225.31637573242188,140.69635009765625 225.31637573242188,181.10452270507812 227.13082885742188,181.10452270507812 228.94525146484375,181.10452270507812 228.94525146484375,140.69635009765625 "
                      id="Path"
                    />
                    <Polygon
                      points="243.46078491210938,140.69635009765625 241.6463623046875,140.69635009765625 241.6463623046875,181.10452270507812 243.46078491210938,181.10452270507812 245.27520751953125,181.10452270507812 245.27520751953125,140.69635009765625 "
                      id="Path"
                    />
                    <Polygon
                      points="258.883544921875,140.69635009765625 257.069091796875,140.69635009765625 257.069091796875,181.10452270507812 258.883544921875,181.10452270507812 260.6979675292969,181.10452270507812 260.6979675292969,140.69635009765625 "
                      id="Path"
                    />
                    <Polygon
                      points="264.32684326171875,140.69635009765625 262.51239013671875,140.69635009765625 262.51239013671875,181.10452270507812 264.32684326171875,181.10452270507812 266.14129638671875,181.10452270507812 266.14129638671875,140.69635009765625 "
                      id="Path"
                    />
                    <Rect
                      height={40.40816}
                      width={1.81444}
                      y={140.69635}
                      x={230.75969}
                      id="Rectangle"
                    />
                    <Rect
                      height={40.40816}
                      width={1.81444}
                      y={140.69635}
                      x={247.08966}
                      id="Rectangle"
                    />
                    <Rect
                      height={40.40816}
                      width={1.81444}
                      y={140.69635}
                      x={249.81132}
                      id="Rectangle"
                    />
                    <Rect
                      height={40.40816}
                      width={1.81444}
                      y={140.69635}
                      x={253.4402}
                      id="Rectangle"
                    />
                    <Polygon
                      points="238.0174560546875,140.69635009765625 236.2030029296875,140.69635009765625 234.38858032226562,140.69635009765625 234.38858032226562,181.10452270507812 236.2030029296875,181.10452270507812 238.0174560546875,181.10452270507812 239.8319091796875,181.10452270507812 239.8319091796875,140.69635009765625 "
                      id="Path"
                    />
                    <Polygon
                      points="271.5845947265625,140.69635009765625 269.7701721191406,140.69635009765625 267.95574951171875,140.69635009765625 267.95574951171875,181.10452270507812 269.7701721191406,181.10452270507812 271.5845947265625,181.10452270507812 273.3990478515625,181.10452270507812 273.3990478515625,140.69635009765625 "
                      id="Path"
                    />
                    <Rect
                      height={40.40816}
                      width={1.81444}
                      y={140.69635}
                      x={274.30626}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={1.81444}
                      y={183.85962}
                      x={221.68749}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={3.62888}
                      y={183.85962}
                      x={225.31637}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={1.81444}
                      y={183.85962}
                      x={230.75969}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={5.44332}
                      y={183.85962}
                      x={234.38858}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={3.62888}
                      y={183.85962}
                      x={241.64634}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={1.81444}
                      y={183.85962}
                      x={247.08966}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={5.44332}
                      y={183.85962}
                      x={249.81132}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={3.62888}
                      y={183.85962}
                      x={257.06908}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={3.62888}
                      y={183.85962}
                      x={262.5124}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={8.16498}
                      y={183.85962}
                      x={267.95572}
                      id="Rectangle"
                    />
                  </G>
                  <G id="001-barcode">
                    <Rect
                      height={40.40816}
                      width={1.81444}
                      y={140.69635}
                      x={274.87669}
                      id="Rectangle"
                    />
                    <Polygon
                      points="280.32000732421875,140.69635009765625 278.5055847167969,140.69635009765625 278.5055847167969,181.10452270507812 280.32000732421875,181.10452270507812 282.13446044921875,181.10452270507812 282.13446044921875,140.69635009765625 "
                      id="Path"
                    />
                    <Polygon
                      points="296.64996337890625,140.69635009765625 294.8355407714844,140.69635009765625 294.8355407714844,181.10452270507812 296.64996337890625,181.10452270507812 298.46441650390625,181.10452270507812 298.46441650390625,140.69635009765625 "
                      id="Path"
                    />
                    <Polygon
                      points="312.0727233886719,140.69635009765625 310.2582702636719,140.69635009765625 310.2582702636719,181.10452270507812 312.0727233886719,181.10452270507812 313.88714599609375,181.10452270507812 313.88714599609375,140.69635009765625 "
                      id="Path"
                    />
                    <Polygon
                      points="317.51605224609375,140.69635009765625 315.70159912109375,140.69635009765625 315.70159912109375,181.10452270507812 317.51605224609375,181.10452270507812 319.3304748535156,181.10452270507812 319.3304748535156,140.69635009765625 "
                      id="Path"
                    />
                    <Rect
                      height={40.40816}
                      width={1.81444}
                      y={140.69635}
                      x={283.94889}
                      id="Rectangle"
                    />
                    <Rect
                      height={40.40816}
                      width={1.81444}
                      y={140.69635}
                      x={300.27886}
                      id="Rectangle"
                    />
                    <Rect
                      height={40.40816}
                      width={1.81444}
                      y={140.69635}
                      x={303.00052}
                      id="Rectangle"
                    />
                    <Rect
                      height={40.40816}
                      width={1.81444}
                      y={140.69635}
                      x={306.6294}
                      id="Rectangle"
                    />
                    <Polygon
                      points="291.2066650390625,140.69635009765625 289.3922119140625,140.69635009765625 287.5777587890625,140.69635009765625 287.5777587890625,181.10452270507812 289.3922119140625,181.10452270507812 291.2066650390625,181.10452270507812 293.0210876464844,181.10452270507812 293.0210876464844,140.69635009765625 "
                      id="Path"
                    />
                    <Polygon
                      points="324.7737731933594,140.69635009765625 322.9593505859375,140.69635009765625 321.1449279785156,140.69635009765625 321.1449279785156,181.10452270507812 322.9593505859375,181.10452270507812 324.7737731933594,181.10452270507812 326.5882263183594,181.10452270507812 326.5882263183594,140.69635009765625 "
                      id="Path"
                    />
                    <Rect
                      height={40.40816}
                      width={1.81444}
                      y={140.69635}
                      x={327.49546}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={1.81444}
                      y={183.85962}
                      x={274.87669}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={3.62888}
                      y={183.85962}
                      x={278.50557}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={1.81444}
                      y={183.85962}
                      x={283.94889}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={5.44332}
                      y={183.85962}
                      x={287.57777}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={3.62888}
                      y={183.85962}
                      x={294.83553}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={1.81444}
                      y={183.85962}
                      x={300.27886}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={5.44332}
                      y={183.85962}
                      x={303.00052}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={3.62888}
                      y={183.85962}
                      x={310.25828}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={3.62888}
                      y={183.85962}
                      x={315.7016}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={8.16498}
                      y={183.85962}
                      x={321.14492}
                      id="Rectangle"
                    />
                  </G>
                  <G
                    transform="translate(136.783, 22.5) scale(-1, 1) translate(-136.783, -22.5) translate(109.567)"
                    id="001-barcode-copy"
                  >
                    <Rect
                      height={40.40816}
                      width={1.81444}
                      y={140.69635}
                      x={-221.68747}
                      id="Rectangle"
                    />
                    <Polygon
                      points="-216.24415588378906,140.69635009765625 -218.05857849121094,140.69635009765625 -218.05857849121094,181.10452270507812 -216.24415588378906,181.10452270507812 -214.42970275878906,181.10452270507812 -214.42970275878906,140.69635009765625 "
                      id="Path"
                    />
                    <Polygon
                      points="-199.91416931152344,140.69635009765625 -201.72862243652344,140.69635009765625 -201.72862243652344,181.10452270507812 -199.91416931152344,181.10452270507812 -198.09974670410156,181.10452270507812 -198.09974670410156,140.69635009765625 "
                      id="Path"
                    />
                    <Polygon
                      points="-184.49143981933594,140.69635009765625 -186.30587768554688,140.69635009765625 -186.30587768554688,181.10452270507812 -184.49143981933594,181.10452270507812 -182.677001953125,181.10452270507812 -182.677001953125,140.69635009765625 "
                      id="Path"
                    />
                    <Polygon
                      points="-179.04811096191406,140.69635009765625 -180.86256408691406,140.69635009765625 -180.86256408691406,181.10452270507812 -179.04811096191406,181.10452270507812 -177.2336883544922,181.10452270507812 -177.2336883544922,140.69635009765625 "
                      id="Path"
                    />
                    <Rect
                      height={40.40816}
                      width={1.81444}
                      y={140.69635}
                      x={-212.61527}
                      id="Rectangle"
                    />
                    <Rect
                      height={40.40816}
                      width={1.81444}
                      y={140.69635}
                      x={-196.2853}
                      id="Rectangle"
                    />
                    <Rect
                      height={40.40816}
                      width={1.81444}
                      y={140.69635}
                      x={-193.56364}
                      id="Rectangle"
                    />
                    <Rect
                      height={40.40816}
                      width={1.81444}
                      y={140.69635}
                      x={-189.93476}
                      id="Rectangle"
                    />
                    <Polygon
                      points="-205.3574981689453,140.69635009765625 -207.1719512939453,140.69635009765625 -208.9863739013672,140.69635009765625 -208.9863739013672,181.10452270507812 -207.1719512939453,181.10452270507812 -205.3574981689453,181.10452270507812 -203.54307556152344,181.10452270507812 -203.54307556152344,140.69635009765625 "
                      id="Path"
                    />
                    <Polygon
                      points="-171.7903594970703,140.69635009765625 -173.60479736328125,140.69635009765625 -175.4192352294922,140.69635009765625 -175.4192352294922,181.10452270507812 -173.60479736328125,181.10452270507812 -171.7903594970703,181.10452270507812 -169.97592163085938,181.10452270507812 -169.97592163085938,140.69635009765625 "
                      id="Path"
                    />
                    <Rect
                      height={40.40816}
                      width={1.81444}
                      y={140.69635}
                      x={-169.0687}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={1.81444}
                      y={183.85962}
                      x={-221.68747}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={3.62888}
                      y={183.85962}
                      x={-218.05859}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={1.81444}
                      y={183.85962}
                      x={-212.61527}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={5.44332}
                      y={183.85962}
                      x={-208.98639}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={3.62888}
                      y={183.85962}
                      x={-201.72862}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={1.81444}
                      y={183.85962}
                      x={-196.2853}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={5.44332}
                      y={183.85962}
                      x={-193.56364}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={3.62888}
                      y={183.85962}
                      x={-186.30588}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={3.62888}
                      y={183.85962}
                      x={-180.86256}
                      id="Rectangle"
                    />
                    <Rect
                      height={1.83673}
                      width={8.16498}
                      y={183.85962}
                      x={-175.41924}
                      id="Rectangle"
                    />
                  </G>
                </G>
              </G>
            </G>
          </G>
        </G>
        {children}
      </Svg>
    </View>
  )
}

export default SvgComponent