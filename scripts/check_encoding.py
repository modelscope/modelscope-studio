import glob
import os


def is_gbk_encoded(file_path):
    try:
        with open(file_path, 'r', encoding='GB2312') as file:
            file.read()
        return True
    except UnicodeDecodeError as e:
        print(f"Error decoding {file_path}: {e}")
        return False


def check_files(glob_pattern):
    has_error = False
    for file_path in glob.glob(glob_pattern, recursive=True):
        if not is_gbk_encoded(file_path):
            has_error = True
            print(f"{file_path} contains non-GB2312 characters.")
    if has_error:
        raise SystemExit(1)


check_files(
    os.path.join(os.path.dirname(__file__),
                 '../backend/modelscope_studio/**/*.py'))
