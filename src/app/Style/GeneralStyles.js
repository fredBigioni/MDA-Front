import { makeStyles } from '@material-ui/core/styles';

const heightW = window.innerHeight;
const widthW = window.innerWidth;

export const useStyles = makeStyles({
    '@global': {
      '*::-webkit-scrollbar': {
        width: '0.8em'
      },
      '*::-webkit-scrollbar-track': {
        '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,.1)',
        outline: '1px solid slategrey'
      }
    },
    rowC: {
      display: 'flex',
      flexDirection: 'row'
    },
    card: {
      width: widthW * 0.19,
      height: heightW * 0.35,
      borderRadius: 5,
      marginTop: '1%',
    },
    title: {
      fontSize: 18,
      marginLeft: '2%'
    },
    pos: {
      marginTop: '5%',
      fontSize: 14
    },
    Lista: {
      marginLeft: '7%'
    },
    textfield: {
      borderRadius: 5,
      width: '97%',
      marginLeft: '3%'
    },
    textfield1: {
      width: '96.56%',
      borderRadius: 5,
      marginLeft: '2%'
    },
    root: {
      width: '100%',
      maxWidth: 360,
      marginLeft: '5%'
    },
    fixedList: {
      width: '100%',
      height: heightW * 0.32,
      backgroundColor: 'white'
    },
    productos: {
      width: widthW * 0.19,
      height: heightW * 0.35,
      position: 'center',
      borderRadius: 5,
      marginTop: '1%',
      marginLeft: '1%',
    },
    presentaciones: {
      height: heightW * 0.34,
      width: '96.56%',
      position: 'center',
      borderRadius: 5,
      marginTop: '1.5%',
      marginLeft: '2%'
    },
    preview: {
      height: heightW * 0.39,
      position: 'center',
      borderRadius: 5,
      marginTop: '1.3%',
      overflow: 'auto',
      width: '100.57%'
    },
    propiedades: {
      height: heightW * 0.39,
      borderRadius: 5,
      marginTop: '3%',
      overflow: 'auto'
    },
    componentes: {
      height: heightW * 0.34,
      position: 'center',
      borderRadius: 5,
      marginTop: '3%',
      marginLeft: '3%',
      overflow: 'auto',
      scrollbarWidth: 'none'
    },
    presentacionCT: {
      height: heightW * 0.34,
      width: '95%',
      position: 'center',
      borderRadius: 5,
      marginTop: '3%',
      marginLeft: '2%',
      overflow: 'auto',
      overflowY: 'hidden'
      
    },
    textfieldCT: {
      width: '95%',
      borderRadius: 5,
      marginLeft: '2%'
    },
    textfieldProd: {
      width: '98%',
      borderRadius: 5,
      marginLeft: '1%'
    },
    presentacionProd: {
      height: heightW * 0.34,
      width: '98%',
      position: 'center',
      borderRadius: 5,
      marginTop: '1%',
      marginLeft: '1%'
    },
    modal: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    modalCard: {
      width: '20%',
      height: '20%'
    },
    closeModalButton: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end'
    },
    button: {
      height: '150%',
      width: 100,
      borderRadius: 10,
      borderColor: 'black',
      border: '2px solid black'
    },
    grupos: {
      width: '100%',
      height: '96%',
      marginTop: '5.1%'
    },
    modalCardMercado: {
      width: '20%',
      height: '50%',
      overflow: 'auto'
    },
    drawer: {
      backgroundColor: '#fff',
      position: 'relative',
      left: '13.8%',
      width: 300,
      top: '7%'
    }
  });