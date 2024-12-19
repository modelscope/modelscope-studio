class AppContext:
    _app = None

    @classmethod
    def set_app(cls, app):
        cls._app = app

    @classmethod
    def has_app(cls):
        return cls._app is not None

    @classmethod
    def assert_app(cls):
        if cls._app is None:
            raise ImportError(
                """<modelscope-studio>: Cannot find the `Application` component, did you forget to import it from `modelscope_studio.components.base`?"""
            )

    @classmethod
    def get_app(cls):
        return cls._app
