import Box, { Caja } from '../Box/Box';

export interface Figura {
  listBoxes: Caja[]
  hashBoard: number
  timestamp: number
}

type FigureProps = {
  listBoxes : Caja[];
}

const Figure = ( {listBoxes} : FigureProps ) =>  (
  <>
    {listBoxes.map( box => {
      return <Box key={box.x+"-"+box.y} caja={box}/>;
    })}
  </>
)

export default Figure;