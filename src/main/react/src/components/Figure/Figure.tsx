import Box, { Caja } from '../Box/Box';

export interface Figura {
  listBoxes: Caja[]
  hashBoard: number
}

const Figure = ( {listBoxes} : Figura ) =>  (
  <>
    {listBoxes.map( box => {
      return <Box key={box.x+"-"+box.y} caja={box}/>;
    })}
  </>
)

export default Figure;