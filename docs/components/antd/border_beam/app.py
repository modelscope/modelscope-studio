from helper.Docs import Docs

docs = Docs(__file__)

if __name__ == "__main__":
    docs.render().queue().launch()
