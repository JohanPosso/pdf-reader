const { requireAuth } = require('../../src/middlewares/auth');

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      session: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  describe('requireAuth', () => {
    it('debería permitir acceso si el usuario está autenticado', () => {
      mockReq.session.userId = 1;

      requireAuth(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('debería denegar acceso si no hay sesión', () => {
      mockReq.session = null;

      requireAuth(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'No autenticado' });
    });

    it('debería denegar acceso si no hay userId en la sesión', () => {
      mockReq.session = {};

      requireAuth(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'No autenticado' });
    });

    it('debería denegar acceso si userId es null', () => {
      mockReq.session.userId = null;

      requireAuth(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'No autenticado' });
    });

    it('debería denegar acceso si userId es undefined', () => {
      mockReq.session.userId = undefined;

      requireAuth(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'No autenticado' });
    });
  });
});
