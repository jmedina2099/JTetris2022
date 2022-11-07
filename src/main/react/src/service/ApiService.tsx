import { Caja } from '../components/Box/Box';

import SERVERNAME from '../servername.json'

import axios from 'axios';

export class ApiService {

    getInterval : Function = () => undefined;
    timeoutFetch : number = 1000;

    fetchFigures( setBoxes : Function, setMyInterval : Function ) {
      const idInterval : NodeJS.Timer[] = [];
      this.getFigures(setBoxes,idInterval);
      idInterval[0] = setInterval(() => this.getFigures(setBoxes,idInterval), this.timeoutFetch);
      setMyInterval(idInterval[0]);
    }

    getFigures( setBoxes : Function, idInterval : NodeJS.Timer[] ) {
      axios
      .get<Caja[]>( SERVERNAME.address+"/figures" )
      .then( response => {
        if( response && response.data && Array.isArray(response.data) ) {
          setBoxes(response.data);
        } else {
          if( idInterval[0] ) clearInterval(idInterval[0]);
          setBoxes([]);
        }
      })
      .catch( (error) => {
        if( idInterval[0] ) clearInterval(idInterval[0]);
      });
    }

    fetchFallingFigure( setBoxesFalling : Function, setMyInterval : Function ) {
      const idInterval : NodeJS.Timer[] = [];
      this.getFallingFigure(setBoxesFalling,idInterval);
      idInterval[0] = setInterval(() => this.getFallingFigure(setBoxesFalling,idInterval), this.timeoutFetch);
      setMyInterval(idInterval[0]);
    }

    getFallingFigure( setBoxesFalling : Function, idInterval : NodeJS.Timer[] ) {
      axios
      .get<Caja[]>( SERVERNAME.address+"/fallingFigure" )
      .then( response => {
        if( response && response.data && Array.isArray(response.data) ) {
          setBoxesFalling(response.data);
        } else {
          if( idInterval[0] ) clearInterval(idInterval[0]);
          setBoxesFalling([]);
        }
      })
      .catch( (error) => {
        if( idInterval[0] ) clearInterval(idInterval[0]);
      });
    }

    start( setRunning : Function, setPaused : Function ) {
      axios
      .get<boolean>( SERVERNAME.address+"/start" )
      .then( response => {
        if( response && typeof response.data === "boolean" ) {
          if( response.data ) {
            setRunning(response.data);
          } else {
            setRunning(true);
            this.pause(setPaused,setRunning);
          }
        } else {
          setRunning(false);
          setPaused(false);
        }
      })
      .catch( (error) => {
        setRunning(false);
        setPaused(false);
      });
    }

    pause( setPaused : Function, setRunning : Function ) {
      axios
      .get<boolean>( SERVERNAME.address+"/pause" )
      .then( response => {
        if( response && typeof response.data === "boolean" ) {
          setPaused(response.data);
        } else {
          setRunning(false);
          this.start(setRunning,setPaused);
        }
      })
      .catch( (error) => {
        setRunning(false);
        setPaused(false);
      });
    }

    space( setCajasCayendo : Function ) {
      axios
      .get<boolean>( SERVERNAME.address+"/space" )
      .then( response => {
        if( response && response.data && Array.isArray(response.data) && response.data.length > 0 ) {
          setCajasCayendo(response.data);
        }
      })
      .catch( (error) => {
        setCajasCayendo([]);
      });
    }

    left( setCajasCayendo : Function ) {
      axios
      .get<boolean>( SERVERNAME.address+"/left" )
      .then( response => {
        if( response && response.data && Array.isArray(response.data) && response.data.length > 0 ) {
          setCajasCayendo(response.data);
        }
      })
      .catch( (error) => {
        setCajasCayendo([]);
      });
    }

    right( setCajasCayendo : Function) {
      axios
      .get<boolean>( SERVERNAME.address+"/right" )
      .then( response => {
        if( response && response.data && Array.isArray(response.data) && response.data.length > 0 ) {
          setCajasCayendo(response.data);
        }
      })
      .catch( (error) => {
        setCajasCayendo([]);
      });
    }

    up( setCajasCayendo : Function) {
      axios
      .get<boolean>( SERVERNAME.address+"/up" )
      .then( response => {
        if( response && response.data && Array.isArray(response.data) && response.data.length > 0 ) {
          setCajasCayendo(response.data);
        }
      })
      .catch( (error) => {
        setCajasCayendo([]);
      });
    }

    down( setCajasCayendo : Function) {
      axios
      .get<boolean>( SERVERNAME.address+"/down" )
      .then( response => {
        if( response && response.data && Array.isArray(response.data) && response.data.length > 0 ) {
          setCajasCayendo(response.data);
        }
      })
      .catch( (error) => {
        setCajasCayendo([]);
      });
    }

}

export default ApiService;