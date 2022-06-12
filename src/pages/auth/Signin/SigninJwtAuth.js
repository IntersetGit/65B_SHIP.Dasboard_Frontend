import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Button, Checkbox, Form, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import IntlMessages from '../../../@crema/utility/IntlMessages';
import { useAuthMethod } from '../../../@crema/utility/AuthHooks';

const SignInJwtAuth = () => {
  const navigate = useNavigate();
  const { signInUser } = useAuthMethod();

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onGoToForgetPassword = () => {
    navigate('/forget-password', { tab: 'jwtAuth' });
  };

  function onRememberMe(e) {
    console.log(`checked = ${e.target.checked}`);
  }

  const { messages } = useIntl();

  return (
    <div className='sign'>
      <div className='sign-content'>
        <Form
          className='sign-form'
          name='basic'
          initialValues={{
            remember: true,
            email: 'admin',
            password: 'Admin%001',
          }}
          onFinish={signInUser}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name='email'
            className='form-field'
            rules={[{ required: true, message: 'Please input your Email!' }]}
          >
            <Input
              prefix={
                <>
                  <UserOutlined />
                  <span>|</span>
                </>
              }
              placeholder={messages['common.email']}
            />
          </Form.Item>

          <Form.Item
            name='password'
            className='form-field'
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password
              prefix={
                <>
                  <LockOutlined />
                  <span>|</span>
                </>
              }
              placeholder={messages['common.password']}
            />
          </Form.Item>

          <div className='rememberMe'>
            <Checkbox onChange={onRememberMe}>
              <IntlMessages id='common.rememberMe' />
            </Checkbox>

            <span className='sign-link' onClick={onGoToForgetPassword}>
              <IntlMessages id='common.forgetPassword' />
            </span>
          </div>

          <div className='form-btn-field'>
            <Button type='primary' htmlType='submit' className='sign-btn'>
              <IntlMessages id='common.login' />
            </Button>
          </div>

          {/* <div className='form-field-action'>
            <span className='sign-text-grey'>
              <IntlMessages id='common.dontHaveAccount' />
            </span>
            <Link to='/signup' className='underlineNone colorTextPrimary'>
              <IntlMessages id='common.signup' />
            </Link>
          </div> */}
        </Form>
      </div>
    </div>
  );
};

export default SignInJwtAuth;
