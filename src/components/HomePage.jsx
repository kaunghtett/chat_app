'use client';

import { Button, Flex, Menu, Layout } from 'antd';
const { Header, Footer, Content } = Layout;


const MainLayout = ({ children }) => {
 
  const headerStyle = {
    textAlign: 'center',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#fff',
  };
  const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
  
  };
 
  const footerStyle = {
    textAlign: 'center',
    color: '#fff',
  };
  const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    width: 'calc(100% - 8px)',
    maxWidth: 'calc(100% - 8px)',
  };
  const Nav = () => {
    const menuitems = [
      { key: 'home', label: 'Home' },
      { key: 'about', label: 'About' },
      { key: 'contact', label: 'Contact' },
    ]
    return (
      <Menu mode="horizontal" style={{ justifyContent: 'flex-end', position: 'sticky', }} items={menuitems} />

    );
  };

  return (
      <Flex horizontal wrap="wrap" >

        <Layout style={layoutStyle}>
          <Header style={headerStyle}>  
             <Nav />
          </Header>
          <Content style={contentStyle}> {children} </Content>
          <Footer style={footerStyle}>Footer</Footer>
        </Layout>
       
    </Flex>
  );
};

const HomePage = () => {
  return (
    <MainLayout >
      <Button type="primary" size="large">
        Hello World
      </Button>
    </MainLayout>
  );
};

export default HomePage;
