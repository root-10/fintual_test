# Portfolio

**Gestión de portafolios desarrollado en JavaScript.**

Permite representar compañías, acciones, posiciones y asignaciones objetivo, además de calcular las operaciones necesarias para rebalancear un portafolio.

> No se validan los valores ingresados, se asumen que son correctos, se ignoran cosas como string válidos, strings únicos, números válidos, etc.

## Clases
### `Company`
Representa una compañía asociada a una acción.

- `name`: nombre de la compañía.

### `Stock`
Representa una acción perteneciente a una compañía.

- `company`: compañía asociada.
- `ticker`: identificador de la acción.
- `name`: nombre de la acción.
- `price`: precio actual, inicialmente null.

#### `currentPrice(lastAvailablePrice)`
Actualiza el precio actual de la acción.

```js
appleStock.currentPrice(100);

portfolio.updatePrices({
  [appleStock.ticker]: 100
});
```

### `Position`
Representa la cantidad de acciones que actualmente posee el portafolio.

- `stock`: acción.
- `quantity`: cantidad de acciones.

#### `marketValue()`
Calcula el valor actual de la posición:

```text
quantity × stock.price
```

> Requiere que la acción tenga un precio disponible.

### `Allocation`
Representa el porcentaje objetivo que una acción debe tener dentro del portafolio.

- `stock`: acción.
- `percentage`: porcentaje objetivo.

Por ejemplo:

```text
AAPL → 60%
META → 40%
```

> Una `Position` representa lo que actualmente se posee, mientras que una `Allocation` representa lo que se busca tener.

### `Portfolio`
Es la clase principal y mantiene tres colecciones:

- `stocks`: acciones conocidas por el portafolio.
- `positions`: posiciones actuales.
- `allocations`: asignaciones objetivo expresado en decimales.

#### `addPosition(stock, quantity)`
Agrega una posición al portafolio.

Si la acción ya tiene una posición, aumenta su cantidad.

#### `setAllocation(stock, percentage)`
Define la asignación objetivo de una acción.

Por ejemplo:

```js
portfolio.setAllocation(appleStock, .6);
portfolio.setAllocation(metaStock, .4);
```

#### `updatePrices(lastAvailablePrices)`
Actualiza el precio de todas las acciones del portafolio utilizando `Stock.currentPrice()`.

```js
portfolio.updatePrices({
  AAPL: 100,
  META: 500
});
```

#### `totalValue()`
Calcula el valor total de las posiciones actuales.

#### `rebalance()`
Calcula las órdenes necesarias para alcanzar las asignaciones objetivo.

El cálculo compara:

```text
Valor objetivo = Valor total × Porcentaje objetivo

Diferencia = Valor objetivo - Valor actual
```

La diferencia determina la acción:

```text
Diferencia positiva → BUY
Diferencia negativa → SELL
```

El resultado contiene:

```js
{
  ticker,
  action,
  quantity,
  price,
  value
}
```
## Consideraciones del rebalanceo
### Acción sin allocation
Si una acción pertenece al portafolio pero no tiene una asignación:

```js
const targetPercentage = allocation ? allocation.percentage : 0;
```

Se considera que su objetivo es `0%`.

Si existe una posición, el rebalanceo puede generar una orden `SELL`.

### Allocation sin position
Si una acción tiene una asignación pero no existe una posición, su valor actual se considera `0`.

Si su porcentaje objetivo es mayor a `0%`, el rebalanceo puede generar una orden `BUY`.

### Diferencias pequeñas
No se genera una orden cuando la diferencia es menor a `0.01`:

```js
if (Math.abs(difference) < 0.01)
  continue;
```

Esto evita generar órdenes para diferencias insignificantes.

## Flujo de uso
El flujo principal del módulo es:

```text
Crear Companies
      ↓
Crear Stocks
      ↓
Crear Portfolio
      ↓
Agregar Positions
      ↓
Actualizar precios
      ↓
Definir Allocations
      ↓
Rebalancear
```

## Creación de la documentación
Hice uso de ChatGPT público para crear esta documentación, primero hice 2 prompts y luego realice unas pequeñas ediciones.

Prompt 1:
```
I'm a Software Engineer presenting a POC of an Portfolio Management, this are the files:

portfolio.js: 
*Copio el contenido*


main.js:
*Copio el contenido*

Create the doc of the POC as a markdown file considering the following:
- In spanish
- Don't mention POC word
- Use the main.js file as guide of use
- Ignore invalid inputs (as the main file did it)
- Make sure the file isn't too large
- Add a considerations section (ex: allocation ? allocation.percentage : 0)
```

Prompt 2:
```
Can't copy the markdown because I'm seeing the preview, show it as code or comment to copy the content.
```