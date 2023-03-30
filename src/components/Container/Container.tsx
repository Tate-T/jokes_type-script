import s from './Container.module.css';

type ContainerProps = {
  children: JSX.Element
};

const Container = ({ children }: ContainerProps): JSX.Element => {
  return <div className={s.container}>{children}</div>
};

export default Container;
