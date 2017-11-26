const nativeWidth = 838;
const nativeHeight = 620;

const scenes = {

    'Hello World': {
        settings: {
            width: nativeWidth,
            height: nativeHeight
        },
        objects: [
            {
                type: 'sphere',
                center: [0, 0, 10],
                radius: 2.5,
                material: {
                    diffuseColor: [255,255,255]
                }
            }
        ],
        lights: [
            {
                type: 'ambient',
                intensity: 1
            }
        ]
    },

    'Spheres': {
        settings: {
            width: nativeWidth,
            height: nativeHeight,
            ambientColor: [30, 30, 50]
        },
        objects: [],
        lights: [
            {
                type: 'ambient',
                intensity: 0.05
            }, {
                type: 'point',
                intensity: 0.95,
                position: [10, 20, -10]
            }
        ]
    },

    'All Display Objects': {
        settings: {
            width: nativeWidth,
            height: nativeHeight,
            ambientColor: [30, 30, 50]
        },
        objects: [
            {
                type: 'plane',
                position: [0, -3, 0],
                normal: [0, 1, 0],
                material: {
                    diffuseColor: [255,0,0]
                }
            },
            {
                type: 'triangle',
                points: [
                    [-3, 2.5, 10],
                    [-0.5, -2.5, 10],
                    [-5.5, -2.5, 10]
                ],
                radius: 2.5,
                material: {
                    diffuseColor: [0,255,0]
                }
            },
            {
                type: 'sphere',
                center: [3, 0, 10],
                radius: 2.5,
                material: {
                    diffuseColor: [0,0,255]
                }
            }
        ],
        lights: [
            {
                type: 'ambient',
                intensity: 0.2
            }, {
                type: 'point',
                intensity: 0.8,
                position: [10, 20, -10]
            }
        ]
    },

    'No Ambient Occlusion': {
        settings: {
            width: nativeWidth*2,
            height: nativeHeight*2,
            ambientColor: [30, 30, 50]
        },
        objects: [
            {
                type: 'plane',
                position: [0, -3, 0],
                normal: [0, 1, 0],
                material: {
                    diffuseColor: [200,200,200],
                }
            },
            {
                type: 'plane',
                position: [0, 0, 20],
                normal: [1, 0, -1],
                material: {
                    diffuseColor: [200,200,200]
                }
            },
            {
                type: 'plane',
                position: [0, 0, 20],
                normal: [-1, 0, -1],
                material: {
                    diffuseColor: [200,200,200]
                }
            },
            {
                type: 'sphere',
                center: [3, 0, 10],
                radius: 2.5,
                material: {
                    diffuseColor: [200,200,200],
                    roughness: 0.1
                }
            },
            {
                type: 'sphere',
                center: [-5, -5.5, 10],
                radius: 5,
                material: {
                    diffuseColor: [200,200,200],
                    roughness: 0.1
                }
            },
            {
                type: 'sphere',
                center: [-1.4, -2.2, 8],
                radius: 1,
                material: {
                    diffuseColor: [200,200,200],
                    roughness: 0.1
                }
            }
        ],
        lights: [
            {
                type: 'ambient',
                intensity: 0.6
            }, {
                type: 'point',
                intensity: 0.4,
                position: [10, 20, -10]
            }
        ]
    },

    'Ambient Occlusion': {
        settings: {
            width: nativeWidth*2,
            height: nativeHeight*2,
            ambientColor: [30, 30, 50],
            ambientOcclusion: 20
        }
    },

    'Textures and Specular': {
        settings: {
            width: nativeWidth*2,
            height: nativeHeight*2,
            ambientColor: [100, 100, 100]
        },
        objects: [
            {
                type: 'sphere',
                center: [-5, 3, 13],
                radius: 2.4,
                material: {
                    diffuseColor: [120,120,120],
                    roughness: 0.04
                }
            },
            {
                type: 'sphere',
                center: [0, 3, 13],
                radius: 2.4,
                material: {
                    specular: 1,
                    diffuseColor: [120,120,120],
                    roughness: 0.02
                }
            },
            {
                type: 'sphere',
                center: [5, 3, 13],
                radius: 2.4,
                material: {
                    specular: 1,
                    diffuseColor: [120,120,120],
                    normalMap: {src: 'obj/textures/football-normals.png'}
                }
            },
            {
                type: 'sphere',
                center: [-4.2, -2.2, 10],
                radius: 2,
                material: {
                    diffuseColor: [255,255,255],
                    diffuseTexture: {src: 'obj/textures/football-diffuse.png'}
                }
            },
            {
                type: 'sphere',
                center: [0, -2.2, 10],
                radius: 2,
                material: {
                    specular: 1,
                    diffuseColor: [255,255,255],
                    diffuseTexture: {src: 'obj/textures/football-diffuse.png'}
                }
            },
            {
                type: 'sphere',
                center: [4.2, -2.2, 10],
                radius: 2,
                material: {
                    specular: 1,
                    diffuseColor: [255,255,255],
                    diffuseTexture: {src: 'obj/textures/football-diffuse.png'},
                    normalMap: {src: 'obj/textures/football-normals.png'},
                }
            }
        ],
        lights: [
            {
                type: 'ambient',
                intensity: 0.05
            }, {
                type: 'point',
                intensity: 0.95,
                position: [30, 40, -40]
            }
        ]
    },

    'Fire Hydrant': {
        settings: {
            width: nativeWidth*2,
            height: nativeHeight*2,
            ambientColor: [200, 200, 255],
            ambientOcclusion: 10
        },
        objects: [
            {
                type: 'plane',
                position: [0, -2, 0],
                normal: [0, 1, 0],
                material: {
                    diffuseColor: [50, 150, 50],
                    reflection: 0,
                    roughness: 0.3
                }
            },
            {
                type: 'sphere',
                center: [2, -0.5, 5],
                radius: 1.5,
                material: {
                    diffuseColor: [255, 0, 0],
                    reflection: 0.1,
                    roughness: 0.2,
                    specular: 1
                }
            },
            {
                type: 'obj',
                file: '/reetracer/obj/hydrant.obj',
                scale: 4,
                offset: [-2, -2, 5],
                rotate: [0, 1, 0],
                renderBackside: false,
                invertNormals: true,
                material: {
                    diffuseColor: [255, 0, 0],
                    reflection: 0.1,
                    roughness: 0.2,
                    specular: 1
                }
            }
        ],
        lights: [
            {
                type: 'ambient',
                intensity: 0.2
            }, {
                type: 'point',
                intensity: 0.8,
                position: [4, 10, 0]
            }
        ]
    },

    'Space ships A': {
        settings: {
            width: nativeWidth,
            height: nativeHeight,
            ambientColor: [10, 10, 100],
            ambientOcclusion: 20
        },
        objects: [
            {
                type: 'plane',
                position: [0, -2, 0],
                normal: [0, 1, 0],
                material: {
                    diffuseColor: [50, 150, 50],
                    reflection: 0,
                    roughness: 0.3
                }
            },{
                type: 'obj',
                file: '/reetracer/obj/plane.obj',
                scale: 0.2,
                offset: [0.35, -0.9, 6],
                rotate: [0, -Math.PI/4, 0],
                renderFlat: true,
                invertNormals: true,
                material: {
                    diffuseColor: [255, 255, 255],
                    diffuseTexture: {src: 'obj/textures/plane.png'},
                    reflection: 0,
                    roughness: 0
                }
            }, {
                type: 'obj',
                file: '/reetracer/obj/plane.obj',
                scale: 0.2,
                offset: [0.35, 5, 20],
                rotate: [0, -Math.PI*0.7, 0],
                renderFlat: true,
                invertNormals: true,
                material: {
                    diffuseColor: [255, 255, 255],
                    diffuseTexture: {src: 'obj/textures/plane.png'},
                    reflection: 0,
                    roughness: 0
                }
            }, {
                type: 'obj',
                file: '/reetracer/obj/plane.obj',
                scale: 0.2,
                offset: [4, 9, 26],
                rotate: [0, -Math.PI*0.7, 0],
                renderFlat: true,
                invertNormals: true,
                material: {
                    diffuseColor: [255, 255, 255],
                    diffuseTexture: {src: 'obj/textures/plane.png'},
                    reflection: 0,
                    roughness: 0
                }
            }
        ],
        lights: [
            {
                type: 'ambient',
                intensity: 0.2
            }, {
                type: 'point',
                intensity: 0.8,
                position: [4, 10, 0]
            }
        ]
    },

    'Space ships B': {
        settings: {
            width: nativeWidth,
            height: nativeHeight,
            ambientColor: [10, 10, 50],
            ambientOcclusion: 10
        },
        objects: [
            {
                type: 'obj',
                file: '/reetracer/obj/fighter.obj',
                scale: 0.02,
                offset: [3, 1.8, 30],
                rotate: [0.6, -2.3, 0], //, 0.5, 0.5],
                //renderFlat: true,
                invertNormals: true,
                material: {
                    diffuseColor:  [200, 200, 200],
                    diffuseTexture: {src: 'obj/textures/fighter-diffuse.jpg'},
                    //bump: {src: 'obj/textures/fighter-bump.jpg'},
                    specular: 1.5
                }
            },
            {
                type: 'obj',
                file: '/reetracer/obj/test.obj',
                scale: 30,
                offset: [0, 0, 100],
                //rotate: [0.6, -2.3, 0], //, 0.5, 0.5],
                renderFlat: true,
                invertNormals: true,
                material: {
                    diffuseTexture: {src: 'obj/textures/space.jpg'},
                    castShadows: false,
                    catchShadows: false
                }
            }
        ],
        lights: [
            {
                type: 'ambient',
                intensity: 0.3,
                color: [200, 200, 255]
            }, {
                type: 'point',
                intensity: 0.4,
                position: [5, 10, 0],
                color: [200, 200, 255],
            }
        ]
    },

    'Pong': {
        settings: {
            width: nativeWidth,
            height: nativeHeight
        },
        objects: [
            {
                type: 'plane',
                position: [0, 0, 10.4],
                normal: [0, 0, -1],
                material: {
                    diffuseColor: [200, 200, 255],
                    diffuseTexture: {src: 'obj/textures/pitch.jpg', scale: 0.3}
                }
            },
            {
                type: 'sphere',
                center: [0, 0, 10],
                radius: 0.4,
                material: {
                    diffuseColor: [255, 0, 0],
                    roughness: 0.1,
                    specular: 1
                }
            },
            {
                type: 'sphere',
                center: [2, 1, 10],
                radius: 0.4,
                material: {
                    diffuseColor: [255, 0, 0],
                    roughness: 0.1,
                    specular: 1
                }
            },
            {
                type: 'sphere',
                center: [-5, 2, 10],
                radius: 0.4,
                material: {
                    diffuseColor: [255, 0, 0],
                    roughness: 0.1,
                    specular: 1
                }
            },
            {
                type: 'sphere',
                center: [-12, 0, 10],
                radius: 5,
                material: {
                    diffuseColor: [50, 50, 50],
                    roughness: 0.01
                }
            },
            {
                type: 'sphere',
                center: [12, 0, 10],
                radius: 5,
                material: {
                    diffuseColor: [50, 50, 50],
                    roughness: 0.01
                }
            }
        ],
        lights: [
            {
                type: 'ambient',
                intensity: 0.2,
                color: [200, 200, 255]
            }, {
                type: 'point',
                intensity: 0.5,
                position: [-4, 0, 5],
                color: [255, 255, 255],
                innerRadius: 5,
                outerRadius: 10
            }, {
                type: 'point',
                intensity: 0.5,
                position: [4, 0, 5],
                color: [255, 255, 255],
                innerRadius: 5,
                outerRadius: 10
            }
        ]
    }

};

// Mathematical Jazz

let scene = scenes['Spheres'];
for (let i = 0; i < 100; i++) {
    scene.objects.push({
        type: 'sphere',
        center: [i/5-10, Math.sin(i/2)*2, 10 + Math.cos(i/2)*2],
        radius: 0.6,
        material: {
            diffuseColor: [Math.round(Math.random() * 200 + 55), Math.round(Math.random() * 200 + 55), Math.round(Math.random() * 200 + 55)],
            reflection: 0
        }
    });
}
scenes['Ambient Occlusion'].objects = scenes['No Ambient Occlusion'].objects;
scenes['Ambient Occlusion'].lights = scenes['No Ambient Occlusion'].lights;