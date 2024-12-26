// 'use client'

// import React, { useRef } from 'react'
// import { Canvas, useFrame } from '@react-three/fiber'
// import { Mesh } from 'three'
// import { OrbitControls, Stars } from '@react-three/drei'

// /**
//  * Example spinning mesh. You can replace this with
//  * any geometry, or even a custom shader/particles.
//  */
// function RotatingBox() {
//     const boxRef = useRef<Mesh>(null!)

//     // Animate the box rotation on each frame
//     useFrame((state, delta) => {
//         if (boxRef.current) {
//             boxRef.current.rotation.x += delta * 0.1
//             boxRef.current.rotation.y += delta * 0.15
//         }
//     })

//     return (
//         <mesh ref={boxRef}>
//             {/* Box geometry */}
//             <boxGeometry args={[1, 1, 1]} />
//             {/* Material with a simple color */}
//             <meshStandardMaterial color="#00AEEF" />
//         </mesh>
//     )
// }

// /**
//  * The main background scene component.
//  * Renders a Canvas fullscreen behind your app.
//  */
// export default function ThreeBackground() {
//     return (
//         <div className="fixed inset-0 -z-10">
//             <Canvas>
//                 {/* A super-simple environment with a rotating box and stars */}
//                 <ambientLight intensity={0.2} />
//                 <directionalLight position={[10, 10, 5]} intensity={0.7} />
//                 <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
//                 <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
//                 <RotatingBox />
//             </Canvas>
//         </div>
//     )
// }