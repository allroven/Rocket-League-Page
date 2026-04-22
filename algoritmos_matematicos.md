# Demostración de Algoritmos Matemáticos - Rocket League Simulator

En el proyecto, la lógica matemática y los algoritmos que simulan las físicas del juego se dividen principalmente en dos áreas: el **Motor Matemático (Clase Base)** y el **Simulador Visual (Componente React)**.

## 1. Motor Matemático: Clase `Vector3D`
**Archivo:** `src/math/Vector3D.js`

Esta clase es el núcleo de todas las operaciones físicas. Implementa directamente las fórmulas matemáticas teóricas para trabajar con vectores en un espacio tridimensional o bidimensional.

### Algoritmos implementados:
*   **Suma de Vectores (`add`)**: Implementa $A + B = (A_x+B_x, A_y+B_y, A_z+B_z)$. Usado para sumar vectores y calcular posiciones finales en desplazamientos.
*   **Multiplicación Escalar (`multiplyScalar`)**: Implementa $V \cdot t = (V_x \cdot t, V_y \cdot t, V_z \cdot t)$. Esencial para la fórmula del MRU (Velocidad por Tiempo).
*   **Magnitud (`magnitude`)**: Implementa $|V| = \sqrt{x^2 + y^2 + z^2}$. Se utiliza para conocer la velocidad absoluta o longitud del vector de desplazamiento.
*   **Normalización (`normalize`)**: Implementa $\hat{V} = \frac{V}{|V|}$. Transforma un vector en un vector unitario (de longitud 1) conservando su dirección. Utilizado para crear direcciones exactas de disparo (apuntando con el mouse) antes de aplicar la fuerza.
*   **Producto Punto (`dot`)**: Implementa $A \cdot B = (A_x \cdot B_x) + (A_y \cdot B_y) + (A_z \cdot B_z)$. Operación fundamental, utilizada dentro de la fórmula de reflexión.
*   **Reflexión (`reflect`)**: Implementa la fórmula de rebote elástico: $R = V - 2(V \cdot N)N$. Calcula el vector resultante cuando el balón choca contra las paredes de la cancha, usando la normal ($N$) de la pared y el vector de impacto ($V$).

---

## 2. Implementación Práctica y Visual: `RocketMathSimulator.jsx`
**Archivo:** `src/components/simulators/RocketMathSimulator.jsx`

En este componente se ponen en práctica los métodos de la clase `Vector3D` aplicándolos a situaciones y mecánicas del entorno de *Rocket League*.

### A. Movimiento Rectilíneo Uniforme (MRU)
**Fórmula Matemática:** $P_f = P_0 + V \cdot t$ (Posición Final = Posición Inicial + Velocidad × Tiempo).
*   **Se demuestra en las funciones:** `startInteractiveMRU` y `runTestMRU`.
*   **¿Cómo se aplica?**
    Se instancia un vector de posición inicial ($P_0$) y un vector de velocidad ($V$). Se utiliza el método `v.multiplyScalar(t)` para multiplicar la velocidad por el tiempo (o el *delta de tiempo* del *frame* de animación), y luego el método de suma `p0.add(...)` para obtener la posición actual o final del balón en la cancha en tiempo real. 

### B. Rebote Libre (Reflexión de Vectores y Colisiones)
**Fórmula Matemática:** $R = V - 2(V \cdot N)N$
*   **Se demuestra en las funciones:** `handleCanvasClick` y `runTestBounce`.
*   **¿Cómo se aplica?**
    En `handleCanvasClick`, el balón se mueve en una trayectoria constante gracias al MRU. En cada *frame* se evalúa (con un condicional `if`) si su posición supera los límites de la cancha (`Math.abs(currentPos.x) >= límiteX` o `Math.abs(currentPos.y) >= límiteY`).
    Al detectar colisión (por ejemplo, con la pared Y trasera y descartando la zona de Gol):
    1. Se define el vector normal de la pared con la que choca: `const normal = new Vector3D(0, currentPos.y > 0 ? -1 : 1, 0);`.
    2. Se llama al algoritmo de reflexión de la clase `Vector3D`: `const r = v.reflect(normal)`.
    3. La velocidad de trayectoria de la bola asume inmediatamente el valor del reflejo (`v = r`), provocando que visual y matemáticamente el balón rebote en el ángulo elástico exacto.

### C. Casos de Prueba (Validación Teórica)
*   **Se demuestra en las funciones:** `runTestVector` y las interfaces de consola.
*   **¿Cómo se aplica?**
    El usuario puede ingresar valores escalares estáticos desde el formulario (UI). El componente llama secuencialmente a los métodos `a.add(b)`, `a.dot(b)`, `a.normalize()`, guardando los resultados en memoria y pintando visualmente los vectores ($A$, $B$, y Vector Resultante) en el plano cartesiano del *Canvas*.

---
**Resumen:**
Los algoritmos (las "fórmulas puras") están rigurosamente definidos en **`Vector3D.js`** actuando como un motor pasivo. El componente **`RocketMathSimulator.jsx`** actúa como el bucle de juego (Game Loop), ejecutando integraciones numéricas (aplicando la fórmula del MRU repetidamente en el tiempo) y evaluando colisiones para activar la fórmula de Reflexión del motor.
