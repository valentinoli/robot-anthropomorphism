import os
import json
import pandas as pd
import numpy as np
from glob import glob
from constants import *

def collect_one_feature(vid_data, aggregate="mean"):
    """
    Description: Collects the features over time of one processed video 
                     (stored in one json file)

    Arguments: 
    aggregate -- if not none, aggregates each features over time 
                either by taking the mean or by taking the max
    identifier -- data as json file

    Outputs: 
    If aggregate!=None return a single row containing the 
             aggregated features over time, otherwise each row represents
             a timestamp and each column is a feature
    """
    expressions = vid_data["data"].get("expressions", None)
    
    if expressions is None: # camera couldn't detect a face
        result = pd.DataFrame(-np.ones(len(FEATURES))).transpose()
        result.columns = FEATURES
        result["nb_timestamps"] = 0
        # reorder the columns to have the nb_timestamps first
        columns_reorder = list(result.columns[-1:]) + list(result.columns[:-1])
        result = result[columns_reorder]
        return result
        
    df_features = pd.DataFrame(expressions)
    df_features["time"] = vid_data["timestamps"]
    df_features.set_index("time", inplace=True)
    
    if aggregate is None:
        return df_features
    
    # if we aggregate, also add a column giving the length of the time series before aggregation
    if aggregate == "mean":
        result = pd.DataFrame(df_features.mean(axis=0)).transpose()

    elif aggregate == "max":
        result = pd.DataFrame(df_features.max(axis=0)).transpose() 
   
    else:
        raise ValueError('aggregate parameter can only be "mean" or "max" (passed: {0})'.format(aggregate))
 
    result["nb_timestamps"] = len(df_features)

    # reorder the columns to have the nb_timestamps first
    columns_reorder = list(result.columns[-1:]) + list(result.columns[:-1])
    result = result[columns_reorder]
    return result


def collect_features(video_data, aggregate="mean"):
    """
    Description: 
    Collects all features (stored in all the json files)
                 from each processed videos and group them in a dataframe.
                 
    Arguments: 
    aggregate -- the way we aggregate the facial features over
               time, either mean or max
               
    Outputs: 
    A dataframe where each row represents a processed 
             video and each columns is a facial feature recorded during that video.
    """

    # one df per video
    df_videos = []
    
    # process videos one-by-one
    for i in range(NB_VIDEOS):
        df_videos.append(collect_one_feature(video_data[str(i+1)], aggregate=aggregate))
        
    # concatenated the three df
    
    result = pd.concat(df_videos)
    # add the video_id for each line of the df
    result["video_id"] = np.arange(NB_VIDEOS) + 1
    
    # reorder the columns to have the video_id first
    columns_reorder = list(result.columns[-1:]) + list(result.columns[:-1])
    result = result[columns_reorder]
    
    return result
    
     
def collect_answers(surveys_data, agg_survey):
    def get_val(survey_data, name):
        # given the question name and data of a particular survey data, return its answered value
        for pair in survey_data:
            if pair["name"] == name:
                return pair["value"]
    
    # collect answers in a NB_VIDEOS x NB_QUESTIONS + 1 array  (+ 1 to indicat video id)
    answers = np.zeros((NB_VIDEOS, NB_QUESTIONS + 1))
    
    # process videos one-by-one
    for i in range(NB_VIDEOS):
        answers[i][0] = i + 1 # set video id
        for idx,k in enumerate(ANSWERS_DICT.keys()):
            answers[i][idx+1] = get_val(surveys_data[str(i+1)],k)
            
    result = pd.DataFrame(data=answers, columns=["video_id"] + ANSWERS_COLUMNS)
    
    if agg_survey:
        for impression in IMPRESSIONS:
            result[impression] = result[IMPRESSIONS[impression]].mean(axis=1)
        result = result[["video_id"] + list(IMPRESSIONS.keys())]
        
    return result

def extract_data(data, agg_survey=False, agg_features="mean"):
    video_data = data["video"]
    survey_data = data["survey"]
    df_features = collect_features(video_data, agg_features)
    df_answers = collect_answers(survey_data, agg_survey)
    df_general = pd.DataFrame(data["general"],index=[0])
    return df_features, df_answers, df_general


def collect_time_series(feature_name):
     # get data files
    filenames = [y for x in os.walk(DATA_PATH) for y in glob(os.path.join(x[0], '*.json'))]
    time_series_list = []
    # process one file at a time
    for idx, file in enumerate(filenames):
        with open(file) as json_file:
            data = json.load(json_file)
            
            # process videos one-by-one
            for i in range(NB_VIDEOS):
                df_videos.append(collect_one_feature(video_data[str(i+1)], aggregate=aggregate))
        
            
            
def collect_all(agg_survey=False, agg_features="mean"):
    # get data files
    filenames = [y for x in os.walk(DATA_PATH) for y in glob(os.path.join(x[0], '*.json'))]
    
    list_df_features = []
    list_df_answers = []
    list_df_generals = []
    nb_participants = len(filenames)
    
    # process one file at a time
    for idx, file in enumerate(filenames):
        with open(file) as json_file:
            data = json.load(json_file)
            df_features, df_answers, df_general = extract_data(data, agg_survey, agg_features)
            list_df_features.append(df_features)
            list_df_answers.append(df_answers)
            list_df_generals.append(df_general)
    
    # concatenate data for each participant
    df_final_features = pd.concat(list_df_features)
    df_final_answers = pd.concat(list_df_answers)
    df_final_generals = pd.concat(list_df_generals)
    
    # set an id for each user
    user_id = np.arange(nb_participants).repeat(NB_VIDEOS)
    df_final_features["user_id"] = user_id
    df_final_answers["user_id"] = user_id
    df_final_generals["user_id"] = np.arange(nb_participants)
    
    df_final_features.set_index(["user_id","video_id"], inplace=True)
    df_final_answers.set_index(["user_id","video_id"], inplace=True)
    df_final_generals.set_index("user_id", inplace=True)
    
    return df_final_features, df_final_answers, df_final_generals


def collect_time_series(feature_name):
    # get data files
    filenames = [y for x in os.walk(DATA_PATH) for y in glob(os.path.join(x[0], '*.json'))]
    time_series_list = []
    # process one file at a time
    for idx, file in enumerate(filenames):
        with open(file) as json_file:
            video_data = json.load(json_file)["video"]
            
            # process videos one-by-one
            for i in range(NB_VIDEOS):
                time_series_list.append((collect_one_feature(video_data[str(i+1)], aggregate=None)[feature_name]))
    return np.array(time_series_list)